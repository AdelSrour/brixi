import { Module } from '@nestjs/common';
import { SitebuilderController } from './sitebuilder.controller';
import { SitebuilderService } from './sitebuilder.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [SitebuilderController],
  providers: [SitebuilderService],
})
export class SitebuilderModule {}
