import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDoctorBookingStatusDto {
    @ApiProperty({
        enum: [
            BookingStatus.CONFIRMED,
            BookingStatus.COMPLETED,
            BookingStatus.CANCELLED,
        ],
    })
    @IsEnum(BookingStatus)
    status: BookingStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    cancellationReason?: string;
}
