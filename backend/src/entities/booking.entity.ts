import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';
import { HealthPackage } from './health-package.entity';
import { Service } from './service.entity';
import { TimeSlot } from './time-slot.entity';
import { BookingStatus, Gender } from '../shared/enums';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'user_id' })
    userId: string;

    @Column({ type: 'varchar', length: 36, name: 'clinic_id' })
    clinicId: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'package_id' })
    packageId: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'service_id' })
    serviceId: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'time_slot_id' })
    timeSlotId: string;

    // Patient information
    @Column({ type: 'varchar', length: 255, name: 'patient_name' })
    patientName: string;

    @Column({ type: 'varchar', length: 255, name: 'patient_email' })
    patientEmail: string;

    @Column({ type: 'varchar', length: 20, name: 'patient_phone' })
    patientPhone: string;

    @Column({ type: 'date', nullable: true, name: 'patient_dob' })
    patientDob: Date;

    @Column({
        type: 'enum',
        enum: Gender,
        nullable: true,
        name: 'patient_gender',
    })
    patientGender: Gender;

    @Column({ type: 'text', nullable: true })
    notes: string;

    // Booking details
    @Column({ type: 'date', name: 'booking_date' })
    bookingDate: Date;

    @Column({ type: 'time', name: 'booking_time' })
    bookingTime: string;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @Column({ type: 'text', nullable: true, name: 'cancellation_reason' })
    cancellationReason: string;

    @Column({ type: 'timestamp', nullable: true, name: 'cancelled_at' })
    cancelledAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Clinic, (clinic) => clinic.bookings, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @ManyToOne(() => HealthPackage, (pkg) => pkg.bookings, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'package_id' })
    package: HealthPackage;

    @ManyToOne(() => Service, (service) => service.bookings, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @ManyToOne(() => TimeSlot, (slot) => slot.bookings, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'time_slot_id' })
    timeSlot: TimeSlot;
}
