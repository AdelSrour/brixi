import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Site extends Document {
  @Prop({ required: true, unique: true })
  siteName: string;

  @Prop({ required: true })
  html: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
