import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { landing } from './templates/landing';
import { IBuilderResponse } from './interfaces/builder-response';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SitebuilderService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') ?? 'free';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateTemplate(
    prompt: string,
    phoneNumber: string,
    brandName: string,
    color: string,
    address: string,
  ): Promise<IBuilderResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
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
      let text = response.text();
      text = text.replace(/```(?:html)?\s*([\s\S]*?)\s*```/, '$1');
      const html = text.match(/```(?:html)?\s*([\s\S]*?)\s*```/i);
      
      if (!html) {
        return {
          status: false,
          message: text,
        };
      }

      await this.uploadCDN('test', text);
      return {
        status: true,
        message: text,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Oops! Looks like our AI is not available at the moment.',
      };
    }
  }

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
