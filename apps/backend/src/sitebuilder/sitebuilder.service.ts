import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { landing } from './templates/landing';
import { IBuilderResponse } from './interfaces/builder-response';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site } from './schemas/site.schema';
import { sanitizeUserHtml } from './utils/sanitize-html.util';
import * as FormData from 'form-data';

@Injectable()
export class SitebuilderService {
  private genAI: GoogleGenerativeAI;

  /**
   * SitebuilderService constructor
   * @param configService ConfigService to access environment variables
   * @param httpService  HttpService to make HTTP requests
   */
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectModel(Site.name) private siteModel: Model<Site>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') ?? 'free';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generates a template based on the user's prompt and other details
   * using the Google Generative AI service.
   * @param prompt The user's prompt for the AI to generate a template
   * @param phoneNumber The user's Phone Number
   * @param brandName The user's Brand Name
   * @param color The user's Brand Color
   * @param address The user's Address
   * @returns Response containing the generated template or an error message
   */
  async generateTemplate(
    prompt: string,
    phoneNumber: string,
    brandName: string,
    color: string,
    address: string,
    siteName: string,
  ): Promise<IBuilderResponse> {
    try {
      const existingSite = await this.siteModel.findOne({ siteName });
      if (existingSite) {
        throw new BadRequestException(
          'This subdomain is already taken, please choose another subdomain.',
        );
      }

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const templateSettings = landing(
        prompt,
        phoneNumber,
        brandName,
        color,
        address,
      );

      const result = await model.generateContent(templateSettings);
      const response = await result.response;
      const text = response.text();

      //const text = '```html <!DOCTYPE html><h1>Hello</h1></html>```'; // Placeholder for actual AI response

      let html: string | null = null;
      const match = text.match(/```html\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        html = match[1];
      }

      if (html) {
        html = html.replace(/```(?:html)?\s*([\s\S]*?)\s*```/, '$1');
        html = sanitizeUserHtml(html);

        // Upload to CDN first
        const cdnResponse = await this.uploadCDN(siteName, html);

        if (!cdnResponse?.status) {
          throw new BadRequestException(
            cdnResponse?.message ||
              'Failed to upload your website to CDN. Please try again.',
          );
        }

        // Store in MongoDB only if CDN upload succeeded
        await this.siteModel.create({ siteName, html });

        return {
          status: true,
          message: 'Your website has been created',
        };
      }

      throw new BadRequestException(text);
    } catch (error) {
      // console.error('Error generating template:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        error?.message ||
          'Oops! Looks like our AI is not available at the moment.',
      );
    }
  }

  /**
   * Uploads the HTML content to the CDN
   * @param siteName The subdomain name of the site
   * @param html The HTML content to upload
   * @returns
   */
  async uploadCDN(siteName: string, html: string) {
    const form = new FormData();
    form.append('siteName', siteName);
    // Send HTML as a file
    form.append('file', Buffer.from(html, 'utf-8'), {
      filename: `${siteName}.html`,
      contentType: 'text/html',
    });

    // Add secret key from .env
    const secretKey = this.configService.get<string>('CDN_SECRET_KEY');
    if (secretKey) {
      form.append('secretKey', secretKey);
    }

    const headers = form.getHeaders();

    // Get CDN upload URL from .env via ConfigService
    const cdnUrl =
      this.configService.get<string>('CDN_UPLOAD_URL') ??
      'https://localhost/cdnGateway.php';

    const response = await lastValueFrom(
      this.httpService.post(cdnUrl, form, {
        headers,
      }),
    );

    return response.data;
  }
}
