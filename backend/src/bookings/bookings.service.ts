import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: dto.clinicId },
      select: { id: true, isOpen: true },
    });
    if (!clinic) {
      throw new BadRequestException({
        code: 'INVALID_CLINIC',
        message: 'Invalid clinicId',
      });
    }

    if (dto.doctorId) {
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: dto.doctorId },
        select: { id: true, clinicId: true },
      });
      if (!doctor || doctor.clinicId !== dto.clinicId) {
        throw new BadRequestException({
          code: 'INVALID_DOCTOR',
          message: 'Invalid doctorId for this clinic',
        });
      }
    }

    const bookingDate = new Date(dto.bookingDate);
    if (Number.isNaN(bookingDate.getTime())) {
      throw new BadRequestException({
        code: 'INVALID_BOOKING_DATE',
        message: 'Invalid bookingDate',
      });
    }

    const patientDob = dto.patientDob ? new Date(dto.patientDob) : undefined;
    if (dto.patientDob && Number.isNaN(patientDob?.getTime())) {
      throw new BadRequestException({
        code: 'INVALID_PATIENT_DOB',
        message: 'Invalid patientDob',
      });
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        clinicId: dto.clinicId,
        doctorId: dto.doctorId,
        patientName: dto.patientName,
        patientEmail: dto.patientEmail,
        patientPhone: dto.patientPhone,
        patientDob,
        patientGender: dto.patientGender,
        notes: dto.notes,
        bookingDate,
        bookingTime: dto.bookingTime,
      },
      select: {
        id: true,
        status: true,
        bookingDate: true,
        bookingTime: true,
        clinic: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    return booking;
  }

  async myBookings(userId: string) {
    const items = await this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        status: true,
        bookingDate: true,
        bookingTime: true,
        patientName: true,
        clinic: { select: { id: true, name: true, address: true } },
        doctor: { select: { id: true, name: true } },
        createdAt: true,
      },
    });
    return { items };
  }
}

