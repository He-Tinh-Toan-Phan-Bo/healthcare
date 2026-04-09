import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DoctorServicePricingDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({ minimum: 0 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ required: false, default: 'VND' })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    currency?: string;
}

export class UpsertDoctorServicesDto {
    @ApiProperty({ type: [DoctorServicePricingDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => DoctorServicePricingDto)
    services: DoctorServicePricingDto[];
}
