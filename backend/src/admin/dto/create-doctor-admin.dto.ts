import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateDoctorAdminDto {
    @ApiProperty()
    @IsString()
    clinicId: string;

    @ApiProperty()
    @IsString()
    specialtyId: string;

    @ApiPropertyOptional({ description: 'Optional linked user id' })
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiProperty()
    @IsString()
    name: string;

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
