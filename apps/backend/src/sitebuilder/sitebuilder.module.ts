import { Module } from '@nestjs/common';
import { SitebuilderController } from './sitebuilder.controller';
import { SitebuilderService } from './sitebuilder.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SitebuilderController],
  providers: [SitebuilderService],
})
export class SitebuilderModule {}
