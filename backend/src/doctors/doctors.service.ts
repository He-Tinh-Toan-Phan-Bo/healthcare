import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR_CODES } from '../common/constants/error-codes';
import { QueryDoctorAvailabilityDto } from './dto/query-doctor-availability.dto';
import { QueryDoctorsDto } from './dto/query-doctors.dto';

const doctorDetailSelect = {
  id: true,
  name: true,
  avatar: true,
  bio: true,
  experience: true,
  isAvailable: true,
  qualifications: true,
  clinic: { select: { id: true, name: true, address: true, phone: true, image: true } },
  specialty: { select: { id: true, name: true } },
  createdAt: true,
} as const;

type DoctorAdminSettings = {
  slotDurationMinutes?: number;
  workingHours?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  services?: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    durationMinutes: number;
  }>;
};

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) { }

  async list(dto: QueryDoctorsDto) {
    const where = {
      ...(dto.clinicId ? { clinicId: dto.clinicId } : {}),
      ...(dto.specialtyId ? { specialtyId: dto.specialtyId } : {}),
      ...(dto.q
        ? { name: { contains: dto.q, mode: 'insensitive' as const } }
        : {}),
    };

    const items = await this.prisma.doctor.findMany({
      where,
      orderBy: [{ experience: 'desc' }, { createdAt: 'desc' }],
      take: 50,
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        experience: true,
        isAvailable: true,
        clinic: { select: { id: true, name: true } },
        specialty: { select: { id: true, name: true } },
      },
    });

    return { items };
  }

  async getById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: doctorDetailSelect,
    });

    if (!doctor) {
      throw new NotFoundException({
        code: ERROR_CODES.DOCTOR_NOT_FOUND,
        message: 'Doctor not found',
      });
    }

    const reviewStats = await this.prisma.review.aggregate({
      where: { doctorId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const settings = this.extractAdminSettings(doctor.qualifications);

    return {
      id: doctor.id,
      name: doctor.name,
      avatar: doctor.avatar,
      bio: doctor.bio,
      experience: doctor.experience,
      isAvailable: doctor.isAvailable,
      clinic: doctor.clinic,
      specialty: doctor.specialty,
      services: settings.services ?? [],
      rating: Math.round((reviewStats._avg.rating ?? 0) * 10) / 10,
      reviewCount: reviewStats._count.rating,
      createdAt: doctor.createdAt,
    };
  }

  async getAvailability(doctorId: string, dto: QueryDoctorAvailabilityDto) {
    const date = new Date(dto.date);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_DATE,
        message: 'Invalid date',
      });
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        name: true,
        isAvailable: true,
        qualifications: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException({
        code: ERROR_CODES.DOCTOR_NOT_FOUND,
        message: 'Doctor not found',
      });
    }

    if (!doctor.isAvailable) {
      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: dto.date,
        slotDurationMinutes: 30,
        slots: [],
        bookedSlots: [],
        availableSlots: [],
      };
    }

    const settings = this.extractAdminSettings(doctor.qualifications);
    const slotDurationMinutes = settings.slotDurationMinutes ?? 30;
    const dayOfWeek = date.getDay();
    const workingHour = (settings.workingHours ?? []).find(
      (row) => row.dayOfWeek === dayOfWeek,
    );

    if (!workingHour) {
      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: dto.date,
        slotDurationMinutes,
        slots: [],
        bookedSlots: [],
        availableSlots: [],
      };
    }

    const slots = this.buildTimeSlots(
      workingHour.startTime,
      workingHour.endTime,
      slotDurationMinutes,
    );

    const booked = await this.prisma.booking.findMany({
      where: {
        doctorId,
        bookingDate: date,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
      select: {
        bookingTime: true,
      },
    });

    const bookedSlots = Array.from(new Set(booked.map((row) => row.bookingTime))).sort();
    const bookedSet = new Set(bookedSlots);
    const availableSlots = slots.filter((slot) => !bookedSet.has(slot));

    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: dto.date,
      slotDurationMinutes,
      slots,
      bookedSlots,
      availableSlots,
    };
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

    return settings as DoctorAdminSettings;
  }

  private buildTimeSlots(startTime: string, endTime: string, slotMinutes: number) {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    if (end <= start) {
      return [];
    }

    const slots: string[] = [];
    for (let cursor = start; cursor + slotMinutes <= end; cursor += slotMinutes) {
      slots.push(this.minutesToTime(cursor));
    }

    return slots;
  }

  private timeToMinutes(value: string) {
    const [hourRaw, minuteRaw] = value.split(':');
    const hour = Number(hourRaw);
    const minute = Number(minuteRaw);

    if (
      !Number.isInteger(hour) ||
      !Number.isInteger(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_TIME_FORMAT,
        message: 'Invalid time format in doctor schedule',
      });
    }

    return hour * 60 + minute;
  }

  private minutesToTime(totalMinutes: number): string {
    const hour = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, '0');
    const minute = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
}

