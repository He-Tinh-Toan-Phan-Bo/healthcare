import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { BookingStatus, Gender, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('--- Seeding Process Started (via Nest Context) ---');

  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@healthcare.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';
  const doctorPassword = process.env.DOCTOR_SEED_PASSWORD || 'Doctor@123';
  const patientPassword = process.env.PATIENT_SEED_PASSWORD || 'Patient@123';

  console.log(`Target admin email: ${adminEmail}`);

  try {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const doctorPasswordHash = await bcrypt.hash(doctorPassword, 10);
    const patientPasswordHash = await bcrypt.hash(patientPassword, 10);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: 'Admin Demo',
        phone: '0909000001',
        passwordHash: adminPasswordHash,
        role: UserRole.ADMIN,
        emailVerified: true,
        isActive: true,
      },
      create: {
        name: 'Admin Demo',
        email: adminEmail,
        phone: '0909000001',
        passwordHash: adminPasswordHash,
        role: UserRole.ADMIN,
        emailVerified: true,
        isActive: true,
      },
    });

    console.log(`Admin ready: ${admin.email}`);

    const doctorUsersSeed = [
      {
        name: 'Bác sĩ Lê Văn Phú',
        email: 'doctor.phu@healthcare.com',
        phone: '0909000101',
      },
      {
        name: 'Bác sĩ Nguyễn Thị Mai',
        email: 'doctor.mai@healthcare.com',
        phone: '0909000102',
      },
    ];

    const patientUsersSeed = [
      {
        name: 'Nguyễn Minh Khôi',
        email: 'patient.khoi@healthcare.com',
        phone: '0909000201',
      },
      {
        name: 'Trần Thu Hà',
        email: 'patient.ha@healthcare.com',
        phone: '0909000202',
      },
    ];

    const doctorUsers = [] as Array<{ id: string; email: string }>;
    for (const user of doctorUsersSeed) {
      const created = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          phone: user.phone,
          passwordHash: doctorPasswordHash,
          role: UserRole.DOCTOR,
          emailVerified: true,
          isActive: true,
        },
        create: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          passwordHash: doctorPasswordHash,
          role: UserRole.DOCTOR,
          emailVerified: true,
          isActive: true,
        },
      });
      doctorUsers.push({ id: created.id, email: created.email });
    }

    const patientUsers = [] as Array<{ id: string; email: string }>;
    for (const user of patientUsersSeed) {
      const created = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          phone: user.phone,
          passwordHash: patientPasswordHash,
          role: UserRole.PATIENT,
          emailVerified: true,
          isActive: true,
        },
        create: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          passwordHash: patientPasswordHash,
          role: UserRole.PATIENT,
          emailVerified: true,
          isActive: true,
        },
      });
      patientUsers.push({ id: created.id, email: created.email });
    }

    console.log(
      `Seeded users: ${doctorUsers.length} doctors, ${patientUsers.length} patients`,
    );

    const specialtyNames = [
      'Nội khoa',
      'Nhi khoa',
      'Răng Hàm Mặt',
      'Da liễu',
      'Nhãn khoa',
      'Tai Mũi Họng',
    ];

    const specialties = new Map<string, string>();
    for (const name of specialtyNames) {
      const specialty = await prisma.specialty.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      specialties.set(name, specialty.id);
    }

    const clinicsSeed = [
      {
        name: 'Phòng Khám Đa Khoa An Khang',
        description: 'Phòng khám tổng quát với đội ngũ bác sĩ giàu kinh nghiệm.',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        phone: '028-1234-5678',
        email: 'contact@ankhang.vn',
        website: 'https://ankhang.vn',
        image:
          'https://images.unsplash.com/photo-1519494026892-80bbd2d3fd0d?auto=format&fit=crop&q=80&w=800',
        openingHours: 'T2-T7: 08:00 - 20:00',
        isOpen: true,
      },
      {
        name: 'Nha Khoa Thành Phố',
        description: 'Chuyên khoa nha với trang thiết bị hiện đại, dịch vụ chất lượng.',
        address: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
        phone: '028-2345-6789',
        email: 'contact@nhakhoatp.vn',
        website: 'https://nhakhoatp.vn',
        image:
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
        openingHours: 'T2-CN: 08:00 - 21:00',
        isOpen: true,
      },
    ];

    const clinics = new Map<string, string>();
    for (const clinicSeed of clinicsSeed) {
      const existing = await prisma.clinic.findFirst({
        where: { name: clinicSeed.name },
        select: { id: true },
      });

      const clinic = existing
        ? await prisma.clinic.update({
          where: { id: existing.id },
          data: clinicSeed,
        })
        : await prisma.clinic.create({
          data: clinicSeed,
        });

      clinics.set(clinicSeed.name, clinic.id);
    }

    const doctorProfilesSeed = [
      {
        userEmail: 'doctor.phu@healthcare.com',
        name: 'BS. Lê Văn Phú',
        experience: 15,
        avatar:
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
        bio: 'Chuyên gia nội khoa với hơn 15 năm kinh nghiệm khám tổng quát.',
        clinicName: 'Phòng Khám Đa Khoa An Khang',
        specialtyName: 'Nội khoa',
      },
      {
        userEmail: 'doctor.mai@healthcare.com',
        name: 'BS. Nguyễn Thị Mai',
        experience: 10,
        avatar:
          'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
        bio: 'Bác sĩ nhi khoa tận tâm, tư vấn và theo dõi bệnh nhi định kỳ.',
        clinicName: 'Phòng Khám Đa Khoa An Khang',
        specialtyName: 'Nhi khoa',
      },
    ];

    for (const profile of doctorProfilesSeed) {
      const doctorUser = doctorUsers.find((item) => item.email === profile.userEmail);
      const clinicId = clinics.get(profile.clinicName);
      const specialtyId = specialties.get(profile.specialtyName);

      if (!doctorUser || !clinicId || !specialtyId) {
        continue;
      }

      const existingByUser = await prisma.doctor.findFirst({
        where: { userId: doctorUser.id },
        select: { id: true },
      });

      const existingByName = await prisma.doctor.findFirst({
        where: { name: profile.name },
        select: { id: true, userId: true },
      });

      const targetDoctorId = existingByUser?.id || existingByName?.id;

      if (targetDoctorId) {
        await prisma.doctor.update({
          where: { id: targetDoctorId },
          data: {
            userId: doctorUser.id,
            clinicId,
            specialtyId,
            name: profile.name,
            experience: profile.experience,
            avatar: profile.avatar,
            bio: profile.bio,
            isAvailable: true,
          },
        });
      } else {
        await prisma.doctor.create({
          data: {
            userId: doctorUser.id,
            clinicId,
            specialtyId,
            name: profile.name,
            experience: profile.experience,
            avatar: profile.avatar,
            bio: profile.bio,
            isAvailable: true,
          },
        });
      }
    }

    const articlesSeed = [
      {
        title: '5 dấu hiệu cần khám nội khoa sớm',
        slug: '5-dau-hieu-can-kham-noi-khoa-som',
        description:
          'Các dấu hiệu mệt mỏi kéo dài, đau ngực, khó thở và cách chủ động đi khám để phòng ngừa biến chứng.',
        image:
          'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=900',
        category: 'Nội khoa',
        readTime: '6 phút',
      },
      {
        title: 'Chăm sóc sức khỏe răng miệng đúng cách cho người lớn',
        slug: 'cham-soc-rang-mieng-dung-cach-cho-nguoi-lon',
        description:
          'Hướng dẫn vệ sinh răng miệng hằng ngày, thời điểm lấy cao răng và các lưu ý giúp hạn chế sâu răng.',
        image:
          'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=900',
        category: 'Nha khoa',
        readTime: '7 phút',
      },
      {
        title: 'Lịch tiêm chủng cơ bản cho trẻ dưới 2 tuổi',
        slug: 'lich-tiem-chung-co-ban-cho-tre-duoi-2-tuoi',
        description:
          'Các mốc tiêm chủng quan trọng và lưu ý khi theo dõi phản ứng sau tiêm cho trẻ nhỏ.',
        image:
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=900',
        category: 'Nhi khoa',
        readTime: '5 phút',
      },
    ];

    for (const article of articlesSeed) {
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: article,
        create: article,
      });
    }

    const doctorForBooking = await prisma.doctor.findFirst({
      where: { name: 'BS. Lê Văn Phú' },
      select: { id: true, clinicId: true },
    });

    const patientForBooking = patientUsers[0];

    if (doctorForBooking && patientForBooking) {
      const baseDate = new Date();
      baseDate.setHours(0, 0, 0, 0);

      const bookingSeeds = [
        {
          patientName: 'Nguyễn Minh Khôi',
          patientEmail: 'patient.khoi@healthcare.com',
          patientPhone: '0909000201',
          patientDob: new Date('1998-10-01'),
          patientGender: Gender.MALE,
          notes: 'Thỉnh thoảng bị đau đầu vào buổi tối.',
          bookingDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 1),
          bookingTime: '09:00',
          status: BookingStatus.PENDING,
        },
        {
          patientName: 'Nguyễn Minh Khôi',
          patientEmail: 'patient.khoi@healthcare.com',
          patientPhone: '0909000201',
          patientDob: new Date('1998-10-01'),
          patientGender: Gender.MALE,
          notes: 'Khám theo dõi huyết áp.',
          bookingDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 2),
          bookingTime: '10:00',
          status: BookingStatus.CONFIRMED,
        },
      ];

      for (const seed of bookingSeeds) {
        const existing = await prisma.booking.findFirst({
          where: {
            doctorId: doctorForBooking.id,
            patientEmail: seed.patientEmail,
            bookingDate: seed.bookingDate,
            bookingTime: seed.bookingTime,
          },
          select: { id: true },
        });

        if (existing) {
          await prisma.booking.update({
            where: { id: existing.id },
            data: {
              status: seed.status,
              notes: seed.notes,
              patientName: seed.patientName,
              patientPhone: seed.patientPhone,
              patientDob: seed.patientDob,
              patientGender: seed.patientGender,
            },
          });
          continue;
        }

        await prisma.booking.create({
          data: {
            userId: patientForBooking.id,
            clinicId: doctorForBooking.clinicId,
            doctorId: doctorForBooking.id,
            patientName: seed.patientName,
            patientEmail: seed.patientEmail,
            patientPhone: seed.patientPhone,
            patientDob: seed.patientDob,
            patientGender: seed.patientGender,
            notes: seed.notes,
            bookingDate: seed.bookingDate,
            bookingTime: seed.bookingTime,
            status: seed.status,
          },
        });
      }
    }

    const summary = await Promise.all([
      prisma.user.count(),
      prisma.clinic.count(),
      prisma.doctor.count(),
      prisma.specialty.count(),
      prisma.article.count(),
      prisma.booking.count(),
    ]);

    console.log('--- Demo Data Seeding Completed ---');
    console.log(
      `Counts => users: ${summary[0]}, clinics: ${summary[1]}, doctors: ${summary[2]}, specialties: ${summary[3]}, articles: ${summary[4]}, bookings: ${summary[5]}`,
    );
    console.log(`Admin login => ${adminEmail} / ${adminPassword}`);
    console.log(`Doctor login => doctor.phu@healthcare.com / ${doctorPassword}`);
    console.log(`Doctor login => doctor.mai@healthcare.com / ${doctorPassword}`);
    console.log(`Patient login => patient.khoi@healthcare.com / ${patientPassword}`);
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
