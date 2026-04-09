import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { QueryAdminUsersDto } from './dto/query-admin-users.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateClinicAdminDto } from './dto/create-clinic-admin.dto';
import { UpdateClinicAdminDto } from './dto/update-clinic-admin.dto';
import { CreateDoctorAdminDto } from './dto/create-doctor-admin.dto';
import { UpdateDoctorAdminDto } from './dto/update-doctor-admin.dto';
import { CreateArticleAdminDto } from './dto/create-article-admin.dto';
import { UpdateArticleAdminDto } from './dto/update-article-admin.dto';

const adminArticleSelect = {
  id: true,
  title: true,
  description: true,
  image: true,
  category: true,
  readTime: true,
  slug: true,
  publishedAt: true,
  updatedAt: true,
} as const;

const DEFAULT_ARTICLE_CATEGORY = 'Cẩm nang';
const DEFAULT_ARTICLE_READ_TIME = '5 phút';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(query: QueryAdminUsersDto) {
    const items = await this.prisma.user.findMany({
      where: query.role ? { role: query.role } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        doctorProfile: {
          select: {
            id: true,
            clinicId: true,
            specialtyId: true,
            isAvailable: true,
          },
        },
      },
    });

    return { items };
  }

  async createUser(dto: CreateAdminUserDto) {
    if (dto.role !== UserRole.DOCTOR) {
      throw new BadRequestException({
        code: 'ADMIN_USER_CREATE_ONLY_DOCTOR',
        message: 'Admin can only create doctor accounts',
      });
    }

    const email = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        phone: dto.phone?.trim(),
        role: dto.role,
        passwordHash,
        emailVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });
  }

  async updateUser(id: string, dto: UpdateAdminUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    const updateData: Record<string, unknown> = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name.trim();
    }
    if (dto.email !== undefined) {
      updateData.email = dto.email.trim().toLowerCase();
    }
    if (dto.phone !== undefined) {
      updateData.phone = dto.phone.trim();
    }
    if (dto.role !== undefined) {
      updateData.role = dto.role;
    }
    if (dto.isActive !== undefined) {
      updateData.isActive = dto.isActive;
    }

    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { id };
  }

  async listClinics() {
    const items = await this.prisma.clinic.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        image: true,
        openingHours: true,
        isOpen: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
      },
    });

    return {
      items: items.map((item) => ({ ...item, rating: item.rating.toString() })),
    };
  }

  async createClinic(dto: CreateClinicAdminDto) {
    const clinic = await this.prisma.clinic.create({
      data: {
        name: dto.name.trim(),
        address: dto.address.trim(),
        description: dto.description,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        image: dto.image,
        openingHours: dto.openingHours,
        isOpen: dto.isOpen ?? true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        image: true,
        openingHours: true,
        isOpen: true,
        rating: true,
        reviewCount: true,
      },
    });

    return { ...clinic, rating: clinic.rating.toString() };
  }

  async updateClinic(id: string, dto: UpdateClinicAdminDto) {
    const data: Record<string, unknown> = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }
    if (dto.address !== undefined) {
      data.address = dto.address.trim();
    }
    if (dto.description !== undefined) {
      data.description = dto.description;
    }
    if (dto.phone !== undefined) {
      data.phone = dto.phone;
    }
    if (dto.email !== undefined) {
      data.email = dto.email;
    }
    if (dto.website !== undefined) {
      data.website = dto.website;
    }
    if (dto.image !== undefined) {
      data.image = dto.image;
    }
    if (dto.openingHours !== undefined) {
      data.openingHours = dto.openingHours;
    }
    if (dto.isOpen !== undefined) {
      data.isOpen = dto.isOpen;
    }

    const clinic = await this.prisma.clinic.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        image: true,
        openingHours: true,
        isOpen: true,
        rating: true,
        reviewCount: true,
      },
    });

    return { ...clinic, rating: clinic.rating.toString() };
  }

  async deleteClinic(id: string) {
    await this.prisma.clinic.delete({ where: { id } });
    return { id };
  }

  async listDoctors() {
    const items = await this.prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        name: true,
        experience: true,
        avatar: true,
        bio: true,
        isAvailable: true,
        clinic: { select: { id: true, name: true } },
        specialty: { select: { id: true, name: true } },
        user: { select: { id: true, email: true } },
      },
    });

    return { items };
  }

  async createDoctor(dto: CreateDoctorAdminDto) {
    const doctor = await this.prisma.doctor.create({
      data: {
        clinicId: dto.clinicId,
        specialtyId: dto.specialtyId,
        userId: dto.userId,
        name: dto.name,
        experience: dto.experience ?? 0,
        avatar: dto.avatar,
        bio: dto.bio,
        isAvailable: dto.isAvailable ?? true,
      },
      select: {
        id: true,
        name: true,
        experience: true,
        avatar: true,
        bio: true,
        isAvailable: true,
        clinic: { select: { id: true, name: true } },
        specialty: { select: { id: true, name: true } },
        user: { select: { id: true, email: true } },
      },
    });

    return doctor;
  }

  async updateDoctor(id: string, dto: UpdateDoctorAdminDto) {
    const data: Record<string, unknown> = {};

    if (dto.clinicId !== undefined) {
      data.clinicId = dto.clinicId;
    }
    if (dto.specialtyId !== undefined) {
      data.specialtyId = dto.specialtyId;
    }
    if (dto.userId !== undefined) {
      data.userId = dto.userId;
    }
    if (dto.name !== undefined) {
      data.name = dto.name;
    }
    if (dto.experience !== undefined) {
      data.experience = dto.experience;
    }
    if (dto.avatar !== undefined) {
      data.avatar = dto.avatar;
    }
    if (dto.bio !== undefined) {
      data.bio = dto.bio;
    }
    if (dto.isAvailable !== undefined) {
      data.isAvailable = dto.isAvailable;
    }

    const doctor = await this.prisma.doctor.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        experience: true,
        avatar: true,
        bio: true,
        isAvailable: true,
        clinic: { select: { id: true, name: true } },
        specialty: { select: { id: true, name: true } },
        user: { select: { id: true, email: true } },
      },
    });

    return doctor;
  }

  async deleteDoctor(id: string) {
    await this.prisma.doctor.delete({ where: { id } });
    return { id };
  }

  async listArticles() {
    const items = await this.prisma.article.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 500,
      select: adminArticleSelect,
    });

    return { items };
  }

  async createArticle(dto: CreateArticleAdminDto) {
    const title = dto.title.trim();
    const description = dto.description.trim();
    const baseSlug = this.slugify((dto.slug ?? title).trim());

    if (!baseSlug) {
      throw new BadRequestException({
        code: 'ARTICLE_SLUG_INVALID',
        message: 'Article slug is invalid',
      });
    }

    const slug = await this.generateUniqueArticleSlug(baseSlug);

    return this.prisma.article.create({
      data: {
        title,
        description,
        image: dto.image?.trim() || undefined,
        category: dto.category?.trim() || DEFAULT_ARTICLE_CATEGORY,
        readTime: dto.readTime?.trim() || DEFAULT_ARTICLE_READ_TIME,
        slug,
      },
      select: adminArticleSelect,
    });
  }

  async updateArticle(id: string, dto: UpdateArticleAdminDto) {
    const current = await this.prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!current) {
      throw new NotFoundException({
        code: 'ARTICLE_NOT_FOUND',
        message: 'Article not found',
      });
    }

    const data: Record<string, unknown> = {};

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }
    if (dto.description !== undefined) {
      data.description = dto.description.trim();
    }
    if (dto.image !== undefined) {
      data.image = dto.image.trim() || null;
    }
    if (dto.category !== undefined) {
      data.category = dto.category.trim() || DEFAULT_ARTICLE_CATEGORY;
    }
    if (dto.readTime !== undefined) {
      data.readTime = dto.readTime.trim() || DEFAULT_ARTICLE_READ_TIME;
    }

    if (dto.slug !== undefined || dto.title !== undefined) {
      const slugSource = dto.slug?.trim() || dto.title?.trim() || current.slug;
      const baseSlug = this.slugify(slugSource);
      if (!baseSlug) {
        throw new BadRequestException({
          code: 'ARTICLE_SLUG_INVALID',
          message: 'Article slug is invalid',
        });
      }

      data.slug = await this.generateUniqueArticleSlug(baseSlug, id);
    }

    return this.prisma.article.update({
      where: { id },
      data,
      select: adminArticleSelect,
    });
  }

  async deleteArticle(id: string) {
    const existing = await this.prisma.article.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException({
        code: 'ARTICLE_NOT_FOUND',
        message: 'Article not found',
      });
    }

    await this.prisma.article.delete({ where: { id } });
    return { id };
  }

  private async generateUniqueArticleSlug(
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let candidate = baseSlug;
    let suffix = 2;

    while (true) {
      const existing = await this.prisma.article.findFirst({
        where: excludeId
          ? { slug: candidate, NOT: { id: excludeId } }
          : { slug: candidate },
        select: { id: true },
      });

      if (!existing) {
        return candidate;
      }

      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replaceAll(/[^a-z0-9\s-]/g, '')
      .replaceAll(/\s+/g, '-')
      .replaceAll(/-+/g, '-');
  }
}
