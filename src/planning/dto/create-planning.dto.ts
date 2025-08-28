import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
  IsOptional,
  Matches,
  Allow,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TimeSlotDto {
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  start: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  end: string;

  @IsNotEmpty()
  @IsString()
  label: string;
}

export class CreatePlanningDto {
  @Allow()
  @IsNumber()
  accountId: number;

  @IsString()
  @Matches(/^\d{4}-W\d{2}$/, { message: 'Week must be in format YYYY-Www' })
  @Allow()
  week: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  @IsOptional()
  @Allow()
  days: {
    Monday?: TimeSlotDto[];
    Tuesday?: TimeSlotDto[];
    Wednesday?: TimeSlotDto[];
    Thursday?: TimeSlotDto[];
    Friday?: TimeSlotDto[];
    Saturday?: TimeSlotDto[];
    Sunday?: TimeSlotDto[];
  };
}
