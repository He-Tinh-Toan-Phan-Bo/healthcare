import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryClinicsDto } from './dto/query-clinics.dto';

@Injectable()
export class ClinicsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: QueryClinicsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 12;
    const skip = (page - 1) * limit;

    const where = dto.q
      ? {
          OR: [
            { name: { contains: dto.q, mode: 'insensitive' as const } },
            { address: { contains: dto.q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.clinic.findMany({
        where,
        orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          rating: true,
          reviewCount: true,
          image: true,
          isOpen: true,
          openingHours: true,
        },
      }),
      this.prisma.clinic.count({ where }),
    ]);

    return {
      items: items.map((c) => ({ ...c, rating: c.rating.toString() })),
      page,
      limit,
      total,
    };
  }

  async getById(id: string) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        rating: true,
        reviewCount: true,
        image: true,
        isOpen: true,
        openingHours: true,
        doctors: {
          select: {
            id: true,
            name: true,
            avatar: true,
            experience: true,
            isAvailable: true,
            specialty: { select: { id: true, name: true } },
          },
          take: 12,
        },
      },
    });
    if (!clinic) {
      throw new NotFoundException({
        code: 'CLINIC_NOT_FOUND',
        message: 'Clinic not found',
      });
    }
    return { ...clinic, rating: clinic.rating.toString() };
  }
}

