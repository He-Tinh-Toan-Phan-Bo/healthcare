import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateAdminUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty()
    @MinLength(6)
    @IsString()
    password: string;

    @ApiProperty({ enum: [UserRole.DOCTOR] })
    @IsEnum(UserRole)
    role: UserRole;
}
