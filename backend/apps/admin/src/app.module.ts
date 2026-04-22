import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Local src/ modules (tokens must match what admin/doctor-admin services inject)
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { RedisModule } from '../../../src/common/redis/redis.module';
import { MailModule } from '../../../src/common/mail/mail.module';
import { JwtAuthGuard } from '../../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../src/auth/guards/roles.guard';

// Admin-specific modules from original src
import { AdminModule as CoreAdminModule } from '../../../src/admin/admin.module';
import { DoctorAdminModule } from '../../../src/doctor-admin/doctor-admin.module';
import { AuthModule } from '../../../src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    MailModule,
    CoreAdminModule,
    DoctorAdminModule,
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
