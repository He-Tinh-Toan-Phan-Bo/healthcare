import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDoctorsDto } from './dto/query-doctors.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

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
}

