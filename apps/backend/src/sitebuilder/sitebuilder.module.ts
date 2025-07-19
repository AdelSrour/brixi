import { Module } from '@nestjs/common';
import { SitebuilderController } from './sitebuilder.controller';
import { SitebuilderService } from './sitebuilder.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './schemas/site.schema';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
  ],
  controllers: [SitebuilderController],
  providers: [SitebuilderService],
})
export class SitebuilderModule {}
