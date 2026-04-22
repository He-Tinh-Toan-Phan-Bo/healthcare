import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Local src/ modules (PrismaService, RedisService, MailService tokens must match)
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { RedisModule } from '../../../src/common/redis/redis.module';
import { MailModule } from '../../../src/common/mail/mail.module';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';

// Business modules
import { UsersModule } from '../../../src/users/users.module';
import { ClinicsModule } from '../../../src/clinics/clinics.module';
import { DoctorsModule } from '../../../src/doctors/doctors.module';
import { BookingsModule } from '../../../src/bookings/bookings.module';
import { SpecialtiesModule } from '../../../src/specialties/specialties.module';
import { ArticlesModule } from '../../../src/articles/articles.module';
import { ReviewsModule } from '../../../src/reviews/reviews.module';
import { PackagesModule } from '../../../src/packages/packages.module';
import { HealthModule } from '../../../src/health/health.module';
import { AuthModule } from '../../../src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    MailModule,
    HealthModule,
    UsersModule,
    ClinicsModule,
    DoctorsModule,
    BookingsModule,
    SpecialtiesModule,
    ArticlesModule,
    ReviewsModule,
    PackagesModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
