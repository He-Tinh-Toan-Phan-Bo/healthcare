import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

// Import entities
import { User } from '../../entities/user.entity';
import { Clinic } from '../../entities/clinic.entity';
import { Specialty } from '../../entities/specialty.entity';
import { Service } from '../../entities/service.entity';
import { HealthPackage } from '../../entities/health-package.entity';
import { Booking } from '../../entities/booking.entity';
import { TimeSlot } from '../../entities/time-slot.entity';
import { Review } from '../../entities/review.entity';
import { Article } from '../../entities/article.entity';
import { Category } from '../../entities/category.entity';
import { Doctor } from '../../entities/doctor.entity';
import { WorkingSchedule } from '../../entities/working-schedule.entity';
import { Notification } from '../../entities/notification.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
            type: 'mysql',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
            extra: {
                connectionLimit: 10,
                acquireTimeout: 30000,
                timeout: 30000,
                waitForConnections: true,
                queueLimit: 0,
            },
            entities: [
                User,
                Clinic,
                Specialty,
                Service,
                HealthPackage,
                Booking,
                TimeSlot,
                Review,
                Article,
                Category,
                Doctor,
                WorkingSchedule,
                Notification,
            ],
            synchronize: false,
            logging: configService.get<string>('NODE_ENV') === 'development',
            migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
            migrationsTableName: 'typeorm_migrations',
            timezone: '+07:00',
        };
    },
    inject: [ConfigService],
};

// CLI configuration for migrations
const cliConfigService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: cliConfigService.get<string>('DB_HOST') || 'localhost',
    port: cliConfigService.get<number>('DB_PORT') || 3306,
    username: cliConfigService.get<string>('DB_USERNAME') || 'clinic_user',
    password: cliConfigService.get<string>('DB_PASSWORD') || 'clinic_pass_123',
    database: cliConfigService.get<string>('DB_DATABASE') || 'clinic_booking',
    entities: [__dirname + '/../../entities/*{.ts,.js}'],
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    synchronize: false,
    logging: false,
    timezone: '+07:00',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
