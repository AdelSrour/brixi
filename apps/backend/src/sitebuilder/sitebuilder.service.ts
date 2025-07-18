import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { landing } from './templates/landing';
import { IBuilderResponse } from './interfaces/builder-response';

@Injectable()
export class SitebuilderService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') ?? 'free';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateTemplate(
    prompt: string,
    phoneNumber: string,
    brandName: string,
    color: string,
  ): Promise<IBuilderResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const templateSettings = landing(prompt, phoneNumber, brandName, color);
      const result = await model.generateContent(templateSettings);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1');

      const json = JSON.parse(text);
      return {
        status: json.status,
        message: json.message,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Oops! Looks like our AI is not available at the moment :(',
      };
    }
  }
}
