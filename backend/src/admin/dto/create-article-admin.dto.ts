import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateArticleAdminDto {
    @ApiProperty()
    @IsString()
    @MaxLength(200)
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readTime?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slug?: string;
}
