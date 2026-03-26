import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('--- Seeding Process Started (via Nest Context) ---');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const seedEmail = process.env.ADMIN_SEED_EMAIL || 'admin@healthcare.com';
  const seedPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';

  console.log(`Target Email: ${seedEmail}`);

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: seedEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(seedPassword, 10);
      const admin = await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: seedEmail,
          passwordHash: hashedPassword,
          role: (UserRole as any).SUPER_ADMIN,
          emailVerified: true,
          isActive: true,
        },
      });
      console.log(`Successfully created Super Admin with ID: ${admin.id}`);
    } else {
      console.log('Admin already exists.');
    }

    // --- Demo Data Seeding ---
    console.log('Seeding Specialties...');
    const specialtiesData = ['Nội khoa', 'Nhi khoa', 'Răng Hàm Mặt', 'Da liễu', 'Nhãn khoa', 'Tai Mũi Họng'];
    const createdSpecialties: any[] = [];
    for (const name of specialtiesData) {
      const s = await prisma.specialty.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      createdSpecialties.push(s);
    }

    console.log('Seeding Clinics...');
    const clinicsData = [
      {
        name: 'Phòng Khám Đa Khoa An Khang',
        description: 'Phòng khám chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        phone: '028-1234-5678',
        email: 'contact@ankhang.vn',
        rating: 4.8,
        reviewCount: 256,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d3fd0d?auto=format&fit=crop&q=80&w=800',
        isOpen: true,
        openingHours: 'T2-T7: 8:00 - 20:00',
      },
      {
        name: 'Nha Khoa Thành Phố',
        description: 'Chuyên khoa nha khoa với trang thiết bị hiện đại',
        address: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
        phone: '028-2345-6789',
        email: 'contact@nhakhoatp.vn',
        rating: 4.6,
        reviewCount: 189,
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
        isOpen: true,
        openingHours: 'T2-CN: 8:00 - 21:00',
      },
    ];

    const createdClinics: any[] = [];
    for (const c of clinicsData) {
      const existing = await prisma.clinic.findFirst({ where: { name: c.name } });
      if (!existing) {
        const created = await prisma.clinic.create({ data: c });
        createdClinics.push(created);
      } else {
        const updated = await prisma.clinic.update({ where: { id: existing.id }, data: c });
        createdClinics.push(updated);
      }
    }

    console.log('Seeding Doctors...');
    if (createdClinics.length > 0 && createdSpecialties.length > 0) {
      const doctorsData = [
        {
          name: 'BS. Lê Văn Phú',
          experience: 15,
          avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
          clinicId: createdClinics[0].id,
          specialtyId: createdSpecialties[0].id,
        },
        {
          name: 'BS. Nguyễn Thị Mai',
          experience: 10,
          avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
          clinicId: createdClinics[0].id,
          specialtyId: createdSpecialties[1].id,
        },
      ];

      for (const d of doctorsData) {
        const existing = await prisma.doctor.findFirst({ where: { name: d.name } });
        if (!existing) await prisma.doctor.create({ data: d });
        else await prisma.doctor.update({ where: { id: existing.id }, data: d });
      }
    }

    console.log('--- Demo Data Seeding Completed ---');
  } catch (err) {
    console.error('Seed Error details:', err);
  } finally {
    await app.close();
  }
}

main()
  .catch((e) => {
    console.error('Fatal Error:', e);
    process.exit(1);
  });
