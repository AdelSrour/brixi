import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class GenerateSiteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'prompt must be at least 10 characters long' })
  @Matches(/^[\p{L}\p{N}\s,]+$/u, {
    message:
      'prompt must not contain special characters; only letters, numbers, spaces, and commas are allowed',
  })
  @Matches(/^.{1,200}$/, {
    message: 'prompt cannot be longer than 200 characters',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  prompt: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international phone number',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Brand or Name must be longer than 5 characters',
  })
  @Matches(/^[\p{L}\p{N}\s]+$/u, {
    message: 'Brand or Name must not contain special characters or symbols',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  brandName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([a-zA-Z]+|#[0-9a-fA-F]{3,6}|(?:\d{1,3},\s*){2}\d{1,3})$/, {
    message:
      'color must be a valid color name, hex (#fff or #ffffff), or comma-separated RGB (e.g., 255, 212, 200)',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  color: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Address must be at least 10 characters long',
  })
  @Matches(/^[\p{L}\p{N}\s,.'-]+$/u, {
    message: 'Address contains invalid characters',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+$/, {
    message:
      'Site name must be a valid subdomain (lowercase letters and numbers only, no hyphens or special characters)',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  siteName: string;
}
