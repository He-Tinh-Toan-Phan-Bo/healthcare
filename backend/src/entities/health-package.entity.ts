import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { Booking } from './booking.entity';
import { PackageCategory } from '../shared/enums';

@Entity('health_packages')
export class HealthPackage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'clinic_id' })
    clinicId: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'varchar', length: 10, default: 'VND' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PackageCategory,
    })
    category: PackageCategory;

    @Column({ type: 'json' })
    features: string[];

    @Column({ type: 'boolean', default: false, name: 'is_popular' })
    isPopular: boolean;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => Clinic, (clinic) => clinic.packages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @OneToMany(() => Booking, (booking) => booking.package)
    bookings: Booking[];
}
