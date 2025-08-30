import { All } from '@nestjs/common';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class SendAccountCreatedDto {
  @Allow()
  @IsEmail()
  to!: string;

  @IsString()
  @IsNotEmpty()
  @Allow()
  fullName!: string;

  // Email de connexion à afficher dans le template (peut être = to)
  @IsEmail()
  @Allow()
  email!: string;

  @IsString()
  @MinLength(6)
  @Allow()
  tempPassword!: string;

  @IsUrl()
  @Allow()
  loginUrl!: string;

  @IsOptional()
  @IsUrl()
  @Allow()
  setPasswordUrl?: string;

  // Optionnels si ton service les supporte
  @IsOptional()
  @IsString()
  @Allow()
  appName?: string;

  @IsOptional()
  @IsEmail()
  @Allow()
  supportEmail?: string;
}
