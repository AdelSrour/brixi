import { Controller, Post, Body } from '@nestjs/common';
import { SitebuilderService } from './sitebuilder.service';
import { IBuilderResponse } from './interfaces/builder-response';

@Controller('sitebuilder')
export class SitebuilderController {
  constructor(private readonly SitebuilderService: SitebuilderService) {}

  @Post()
  async generate(
    @Body('prompt') prompt: string,
    phoneNumber: string,
    brandName: string,
    color: string,
  ): Promise<IBuilderResponse> {
    return await this.SitebuilderService.generateTemplate(
      prompt,
      phoneNumber,
      brandName,
      color,
    );
  }
}
