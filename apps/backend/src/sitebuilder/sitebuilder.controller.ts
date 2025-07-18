import { Controller, Post, Body } from '@nestjs/common';
import { SitebuilderService } from './sitebuilder.service';

@Controller('sitebuilder')
export class SitebuilderController {
  constructor(private readonly SitebuilderService: SitebuilderService) {}

  @Post()
  async generate(@Body('prompt') prompt: string): Promise<any> {
    return await this.SitebuilderService.generateTemplate(prompt);
  }
}
