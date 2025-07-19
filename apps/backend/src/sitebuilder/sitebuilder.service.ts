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
        model: 'gemini-2.0-flash',
      });

      // Generate the template settings using the landing template
      const templateSettings = landing(
        prompt,
        phoneNumber,
        brandName,
        color,
        address,
      );

      // Generate the content using the AI model with the template settings
      const result = await model.generateContent(templateSettings);

      // Await the response from the AI model
      const response = await result.response;

      // Extract the text from the response
      const text = response.text();

      // Extract the HTML content from the text
      let html: string | null = null;
      const match = text.match(/```html\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        html = match[1];
      }

      // If HTML content is found
      if (html) {
        // Remove the markdown code block formatting from the HTML
        html = html.replace(/```(?:html)?\s*([\s\S]*?)\s*```/, '$1');

        // Store in MongoDB
        await this.siteModel.create({ siteName, html });

        // upload to CDN as well
        await this.uploadCDN(siteName, html);

        return {
          status: true,
          message: 'Your website has been created',
        };
      }

      // AI returned an error message
      throw new BadRequestException(text);
    } catch (error) {
      // Let the error propagate to the global error handler middleware
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
    const payload = {
      siteName,
      html,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await lastValueFrom(
      this.httpService.post('https://brixi.adel.dev/uploadCDN.php', payload, {
        headers,
      }),
    );

    return response.data;
  }
}
