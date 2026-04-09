import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDoctorAdminDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    clinicId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    specialtyId?: string;

    @ApiPropertyOptional({ description: 'Optional linked user id' })
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    experience?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}
