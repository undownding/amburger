import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class SmsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() regionCode: string
  @ApiProperty() @IsString() @MinLength(6) phone: string
}
