import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR_CODES } from '../common/constants/error-codes';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, dto: CreateBookingDto) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: dto.clinicId },
      select: { id: true, isOpen: true },
    });
    if (!clinic) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_CLINIC,
        message: 'Invalid clinicId',
      });
    }

    if (!clinic.isOpen) {
      throw new BadRequestException({
        code: ERROR_CODES.CLINIC_CLOSED,
        message: 'Selected clinic is currently closed',
      });
    }

    if (dto.doctorId) {
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: dto.doctorId },
        select: { id: true, clinicId: true },
      });
      if (!doctor || doctor?.clinicId !== dto.clinicId) {
        throw new BadRequestException({
          code: ERROR_CODES.INVALID_DOCTOR,
          message: 'Invalid doctorId for this clinic',
        });
      }
    }

    const bookingDate = new Date(dto.bookingDate);
    if (Number.isNaN(bookingDate.getTime())) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_BOOKING_DATE,
        message: 'Invalid bookingDate',
      });
    }

    this.assertNotPastBookingDateTime(bookingDate, dto.bookingTime);

    // Slot is considered locked when another patient already has a pending/confirmed booking.
    if (dto.doctorId) {
      await this.ensureDoctorSlotAvailable(dto.doctorId, bookingDate, dto.bookingTime);
    }

    const patientDob = dto.patientDob ? new Date(dto.patientDob) : undefined;
    if (dto.patientDob && Number.isNaN(patientDob?.getTime())) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_PATIENT_DOB,
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

  async getMyBookingById(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      select: {
        id: true,
        status: true,
        bookingDate: true,
        bookingTime: true,
        patientName: true,
        patientEmail: true,
        patientPhone: true,
        patientDob: true,
        patientGender: true,
        notes: true,
        cancellationReason: true,
        cancelledAt: true,
        clinic: { select: { id: true, name: true, address: true } },
        doctor: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!booking) {
      throw new BadRequestException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      });
    }

    return booking;
  }

  async cancelByPatient(userId: string, bookingId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!booking) {
      throw new BadRequestException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      });
    }

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException({
        code: ERROR_CODES.BOOKING_CANNOT_BE_CANCELLED,
        message: 'Only pending or confirmed bookings can be cancelled',
      });
    }

    return this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CANCELLED,
        cancellationReason: dto.reason?.trim() || 'Cancelled by patient',
        cancelledAt: new Date(),
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

  async rescheduleByPatient(
    userId: string,
    bookingId: string,
    dto: RescheduleBookingDto,
  ) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      select: {
        id: true,
        status: true,
        doctorId: true,
      },
    });

    if (!booking) {
      throw new BadRequestException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found',
      });
    }

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException({
        code: ERROR_CODES.BOOKING_CANNOT_BE_RESCHEDULED,
        message: 'Only pending or confirmed bookings can be rescheduled',
      });
    }

    const nextBookingDate = new Date(dto.bookingDate);
    if (Number.isNaN(nextBookingDate.getTime())) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_BOOKING_DATE,
        message: 'Invalid bookingDate',
      });
    }

    this.assertNotPastBookingDateTime(nextBookingDate, dto.bookingTime);

    if (booking.doctorId) {
      await this.ensureDoctorSlotAvailable(
        booking.doctorId,
        nextBookingDate,
        dto.bookingTime,
        booking.id,
      );
    }

    return this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        bookingDate: nextBookingDate,
        bookingTime: dto.bookingTime,
        status: BookingStatus.PENDING,
        cancellationReason: null,
        cancelledAt: null,
      },
      select: {
        id: true,
        status: true,
        bookingDate: true,
        bookingTime: true,
        updatedAt: true,
      },
    });
  }

  private async ensureDoctorSlotAvailable(
    doctorId: string,
    bookingDate: Date,
    bookingTime: string,
    excludeBookingId?: string,
  ) {
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        doctorId,
        bookingDate,
        bookingTime,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
        ...(excludeBookingId ? { NOT: { id: excludeBookingId } } : {}),
      },
      select: { id: true },
    });

    if (existingBooking) {
      throw new BadRequestException({
        code: ERROR_CODES.BOOKING_SLOT_UNAVAILABLE,
        message: 'This booking slot is not available',
      });
    }
  }

  private assertNotPastBookingDateTime(bookingDate: Date, bookingTime: string) {
    const [hoursRaw, minutesRaw] = bookingTime.split(':');
    const hours = Number(hoursRaw);
    const minutes = Number(minutesRaw);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_BOOKING_TIME,
        message: 'Invalid bookingTime, expected HH:mm',
      });
    }

    const dateTime = new Date(bookingDate);
    dateTime.setHours(hours, minutes, 0, 0);

    if (dateTime.getTime() < Date.now()) {
      throw new BadRequestException({
        code: ERROR_CODES.BOOKING_IN_THE_PAST,
        message: 'Booking date/time cannot be in the past',
      });
    }
  }
}
