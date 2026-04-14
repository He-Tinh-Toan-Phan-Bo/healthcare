import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'clinic_id' })
    clinicId: string;

    @Column({ type: 'varchar', length: 36, name: 'user_id' })
    userId: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'booking_id' })
    bookingId: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => Clinic, (clinic) => clinic.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Booking, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;
}
