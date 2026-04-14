import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Specialty } from './specialty.entity';
import { HealthPackage } from './health-package.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
import { TimeSlot } from './time-slot.entity';
import { Doctor } from './doctor.entity';

@Entity('clinics')
export class Clinic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 500 })
    address: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    website: string;

    @Column({ type: 'decimal', precision: 2, scale: 1, default: 0.0 })
    rating: number;

    @Column({ type: 'int', default: 0, name: 'review_count' })
    reviewCount: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    image: string;

    @Column({ type: 'boolean', default: true, name: 'is_open' })
    isOpen: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'opening_hours' })
    openingHours: string;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToMany(() => Specialty, (specialty) => specialty.clinics)
    @JoinTable({
        name: 'clinic_specialties',
        joinColumn: { name: 'clinic_id' },
        inverseJoinColumn: { name: 'specialty_id' },
    })
    specialties: Specialty[];

    @OneToMany(() => HealthPackage, (pkg) => pkg.clinic)
    packages: HealthPackage[];

    @OneToMany(() => Booking, (booking) => booking.clinic)
    bookings: Booking[];

    @OneToMany(() => Review, (review) => review.clinic)
    reviews: Review[];

    @OneToMany(() => TimeSlot, (slot) => slot.clinic)
    timeSlots: TimeSlot[];

    @OneToMany(() => Doctor, (doctor) => doctor.clinic)
    doctors: Doctor[];
}
