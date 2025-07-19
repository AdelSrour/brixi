import { Body, Controller, Post } from '@nestjs/common';
import { SitebuilderService } from './sitebuilder.service';
import { IBuilderResponse } from './interfaces/builder-response';
import { GenerateSiteDto } from './dto/generate-site.dto';

@Controller('sitebuilder')
export class SitebuilderController {
  constructor(private readonly SitebuilderService: SitebuilderService) {}

  @Post()
  async generate(
    @Body() generateSiteDto: GenerateSiteDto,
  ): Promise<IBuilderResponse> {
    const { prompt, phoneNumber, brandName, color, address, siteName } =
      generateSiteDto;
    return await this.SitebuilderService.generateTemplate(
      prompt,
      phoneNumber,
      brandName,
      color,
      address,
      siteName,
    );
  }
}
