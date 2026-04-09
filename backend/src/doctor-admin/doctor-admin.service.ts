import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDoctorBookingsDto } from './dto/query-doctor-bookings.dto';
import { UpdateDoctorBookingStatusDto } from './dto/update-doctor-booking-status.dto';
import { UpsertDoctorScheduleDto } from './dto/upsert-doctor-schedule.dto';
import { UpsertDoctorServicesDto } from './dto/upsert-doctor-services.dto';

type DoctorAdminSettings = {
    slotDurationMinutes?: number;
    workingHours?: Array<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }>;
    services?: Array<{ name: string; price: number; currency: string }>;
};

@Injectable()
export class DoctorAdminService {
    constructor(private readonly prisma: PrismaService) { }

    async myBookings(userId: string, query: QueryDoctorBookingsDto) {
        const doctor = await this.getDoctorByUserId(userId);

        const where: Prisma.BookingWhereInput = {
            doctorId: doctor.id,
            ...(query.status ? { status: query.status } : {}),
        };

        if (query.date) {
            const from = new Date(query.date);
            if (Number.isNaN(from.getTime())) {
                throw new BadRequestException({
                    code: 'INVALID_DATE',
                    message: 'Invalid date',
                });
            }
            const to = new Date(from);
            to.setDate(to.getDate() + 1);
            where.bookingDate = { gte: from, lt: to };
        }

        const items = await this.prisma.booking.findMany({
            where,
            orderBy: [{ bookingDate: 'asc' }, { bookingTime: 'asc' }],
            take: 200,
            select: {
                id: true,
                status: true,
                bookingDate: true,
                bookingTime: true,
                patientName: true,
                patientEmail: true,
                patientPhone: true,
                notes: true,
                clinic: { select: { id: true, name: true, address: true } },
                createdAt: true,
            },
        });

        return { items };
    }

    async updateBookingStatus(
        userId: string,
        bookingId: string,
        dto: UpdateDoctorBookingStatusDto,
    ) {
        const doctor = await this.getDoctorByUserId(userId);

        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            select: { id: true, doctorId: true, status: true },
        });

        if (!booking || booking.doctorId !== doctor.id) {
            throw new NotFoundException({
                code: 'BOOKING_NOT_FOUND',
                message: 'Booking not found',
            });
        }

        const allowedStatuses: BookingStatus[] = [
            BookingStatus.CONFIRMED,
            BookingStatus.COMPLETED,
            BookingStatus.CANCELLED,
        ];

        if (!allowedStatuses.includes(dto.status)) {
            throw new BadRequestException({
                code: 'INVALID_BOOKING_STATUS',
                message: 'Invalid booking status',
            });
        }

        return this.prisma.booking.update({
            where: { id: booking.id },
            data: {
                status: dto.status,
                cancellationReason:
                    dto.status === BookingStatus.CANCELLED
                        ? (dto.cancellationReason ?? null)
                        : null,
                cancelledAt: dto.status === BookingStatus.CANCELLED ? new Date() : null,
            },
            select: {
                id: true,
                status: true,
                cancellationReason: true,
                cancelledAt: true,
                updatedAt: true,
            },
        });
    }

    async getSettings(userId: string) {
        const doctor = await this.getDoctorByUserId(userId);
        const settings = this.extractAdminSettings(doctor.qualifications);

        return {
            doctor: {
                id: doctor.id,
                name: doctor.name,
                clinicId: doctor.clinicId,
            },
            settings: {
                slotDurationMinutes: settings.slotDurationMinutes ?? 30,
                workingHours: settings.workingHours ?? [],
                services: settings.services ?? [],
            },
        };
    }

    async upsertSchedule(userId: string, dto: UpsertDoctorScheduleDto) {
        const doctor = await this.getDoctorByUserId(userId);

        const updated = await this.updateDoctorAdminSettings(doctor.id, {
            slotDurationMinutes: dto.slotDurationMinutes,
            workingHours: dto.workingHours,
        });

        return {
            id: updated.id,
            settings: this.extractAdminSettings(updated.qualifications),
        };
    }

    async upsertServices(userId: string, dto: UpsertDoctorServicesDto) {
        const doctor = await this.getDoctorByUserId(userId);

        const normalizedServices = dto.services.map((item) => ({
            name: item.name.trim(),
            price: item.price,
            currency: item.currency?.trim().toUpperCase() || 'VND',
        }));

        const updated = await this.updateDoctorAdminSettings(doctor.id, {
            services: normalizedServices,
        });

        return {
            id: updated.id,
            settings: this.extractAdminSettings(updated.qualifications),
        };
    }

    private async getDoctorByUserId(userId: string) {
        const doctor = await this.prisma.doctor.findFirst({
            where: { userId },
            select: {
                id: true,
                userId: true,
                clinicId: true,
                name: true,
                qualifications: true,
            },
        });

        if (!doctor) {
            throw new ForbiddenException({
                code: 'DOCTOR_PROFILE_NOT_FOUND',
                message: 'Doctor profile is not linked to your account',
            });
        }

        return doctor;
    }

    private extractAdminSettings(
        qualifications: Prisma.JsonValue | null,
    ): DoctorAdminSettings {
        if (
            !qualifications ||
            typeof qualifications !== 'object' ||
            Array.isArray(qualifications)
        ) {
            return {};
        }

        const root = qualifications as Record<string, unknown>;
        const settings = root.adminSettings;

        if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
            return {};
        }

        return settings as unknown as DoctorAdminSettings;
    }

    private async updateDoctorAdminSettings(
        doctorId: string,
        partialSettings: Partial<DoctorAdminSettings>,
    ) {
        const current = await this.prisma.doctor.findUnique({
            where: { id: doctorId },
            select: { id: true, qualifications: true },
        });

        if (!current) {
            throw new NotFoundException({
                code: 'DOCTOR_NOT_FOUND',
                message: 'Doctor not found',
            });
        }

        const baseRoot =
            current.qualifications &&
                typeof current.qualifications === 'object' &&
                !Array.isArray(current.qualifications)
                ? ({ ...current.qualifications } as Prisma.JsonObject)
                : ({} as Prisma.JsonObject);

        const currentSettings = this.extractAdminSettings(current.qualifications);
        baseRoot.adminSettings = {
            ...currentSettings,
            ...partialSettings,
        } as unknown as Prisma.JsonValue;

        return this.prisma.doctor.update({
            where: { id: doctorId },
            data: {
                qualifications: baseRoot as Prisma.InputJsonValue,
            },
            select: {
                id: true,
                qualifications: true,
            },
        });
    }
}
