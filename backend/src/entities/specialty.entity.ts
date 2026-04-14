import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { Doctor } from './doctor.entity';

@Entity('specialties')
export class Specialty {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    icon: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // Relations
    @ManyToMany(() => Clinic, (clinic) => clinic.specialties)
    clinics: Clinic[];

    @OneToMany(() => Doctor, (doctor) => doctor.specialty)
    doctors: Doctor[];
}
