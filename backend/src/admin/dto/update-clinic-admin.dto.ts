import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class UpdateClinicAdminDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    website?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    openingHours?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isOpen?: boolean;
}
