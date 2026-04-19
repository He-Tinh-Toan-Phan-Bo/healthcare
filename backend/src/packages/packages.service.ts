import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ERROR_CODES } from '../common/constants/error-codes';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const packages = await this.prisma.healthPackage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return packages;
  }

  async findOne(id: string) {
    const healthPackage = await this.prisma.healthPackage.findUnique({
      where: { id },
    });
    if (!healthPackage) {
      throw new NotFoundException({
        code: ERROR_CODES.PACKAGE_NOT_FOUND,
        message: `Health package with ID ${id} not found`,
      });
    }
    return healthPackage;
  }

  async findByCategory(category: string) {
    return this.prisma.healthPackage.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPopular() {
    return this.prisma.healthPackage.findMany({
      where: { isPopular: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
  }
}
