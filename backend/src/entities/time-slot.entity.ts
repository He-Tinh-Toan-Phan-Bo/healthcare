import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { Booking } from './booking.entity';

@Entity('time_slots')
export class TimeSlot {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'clinic_id' })
    clinicId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'time', name: 'start_time' })
    startTime: string;

    @Column({ type: 'time', name: 'end_time' })
    endTime: string;

    @Column({ type: 'boolean', default: true, name: 'is_available' })
    isAvailable: boolean;

    @Column({ type: 'int', default: 1, name: 'max_bookings' })
    maxBookings: number;

    @Column({ type: 'int', default: 0, name: 'current_bookings' })
    currentBookings: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // Relations
    @ManyToOne(() => Clinic, (clinic) => clinic.timeSlots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @OneToMany(() => Booking, (booking) => booking.timeSlot)
    bookings: Booking[];
}
