import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SitebuilderModule } from './sitebuilder/sitebuilder.module';

@Module({
  imports: [ConfigModule.forRoot(), SitebuilderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
