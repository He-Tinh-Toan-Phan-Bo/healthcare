import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsString,
    Matches,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class WorkingHourDto {
    @ApiProperty({
        minimum: 0,
        maximum: 6,
        description: '0 = Sunday, 6 = Saturday',
    })
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @ApiProperty({ example: '08:00' })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    startTime: string;

    @ApiProperty({ example: '17:00' })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    endTime: string;
}

export class UpsertDoctorScheduleDto {
    @ApiProperty({ minimum: 5, maximum: 180 })
    @IsInt()
    @Min(5)
    @Max(180)
    slotDurationMinutes: number;

    @ApiProperty({ type: [WorkingHourDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => WorkingHourDto)
    workingHours: WorkingHourDto[];
}
