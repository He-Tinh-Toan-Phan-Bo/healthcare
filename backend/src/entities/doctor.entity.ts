import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';
import { Specialty } from './specialty.entity';

@Entity('doctors')
export class Doctor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'user_id' })
    userId: string;

    @Column({ type: 'varchar', length: 36, name: 'clinic_id' })
    clinicId: string;

    @Column({ type: 'varchar', length: 36, name: 'specialty_id' })
    specialtyId: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'json', nullable: true })
    qualifications: string[];

    @Column({ type: 'int', default: 0 })
    experience: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    avatar: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'boolean', default: true, name: 'is_available' })
    isAvailable: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Clinic, (clinic) => clinic.doctors, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clinic_id' })
    clinic: Clinic;

    @ManyToOne(() => Specialty, (specialty) => specialty.doctors, {
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'specialty_id' })
    specialty: Specialty;
}
