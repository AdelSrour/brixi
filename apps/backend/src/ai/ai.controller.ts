import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('generate')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async generate(@Body('prompt') prompt: string): Promise<any> {
    return await this.aiService.generateTemplate(prompt);
  }
}
