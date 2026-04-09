import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Put,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
import { QueryDoctorBookingsDto } from './dto/query-doctor-bookings.dto';
import { UpdateDoctorBookingStatusDto } from './dto/update-doctor-booking-status.dto';
import { UpsertDoctorScheduleDto } from './dto/upsert-doctor-schedule.dto';
import { UpsertDoctorServicesDto } from './dto/upsert-doctor-services.dto';
import { DoctorAdminService } from './doctor-admin.service';

@ApiTags('Doctor Admin')
@ApiBearerAuth('JWT')
@Roles(UserRole.DOCTOR)
@Controller({ path: 'doctor-admin', version: '1' })
export class DoctorAdminController {
    constructor(private readonly doctorAdminService: DoctorAdminService) { }

    @Get('bookings')
    myBookings(
        @CurrentUser() user: JwtUser,
        @Query() query: QueryDoctorBookingsDto,
    ) {
        return this.doctorAdminService.myBookings(user.id, query);
    }

    @Patch('bookings/:id/status')
    updateBookingStatus(
        @CurrentUser() user: JwtUser,
        @Param('id') id: string,
        @Body() dto: UpdateDoctorBookingStatusDto,
    ) {
        return this.doctorAdminService.updateBookingStatus(user.id, id, dto);
    }

    @Get('settings')
    getSettings(@CurrentUser() user: JwtUser) {
        return this.doctorAdminService.getSettings(user.id);
    }

    @Put('settings/schedule')
    upsertSchedule(
        @CurrentUser() user: JwtUser,
        @Body() dto: UpsertDoctorScheduleDto,
    ) {
        return this.doctorAdminService.upsertSchedule(user.id, dto);
    }

    @Put('settings/services')
    upsertServices(
        @CurrentUser() user: JwtUser,
        @Body() dto: UpsertDoctorServicesDto,
    ) {
        return this.doctorAdminService.upsertServices(user.id, dto);
    }
}
