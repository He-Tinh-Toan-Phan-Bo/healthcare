import { BookingStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class QueryDoctorBookingsDto {
    @IsOptional()
    @IsEnum(BookingStatus)
    status?: BookingStatus;

    @IsOptional()
    @IsDateString()
    date?: string;
}
