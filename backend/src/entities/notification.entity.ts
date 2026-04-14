import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { NotificationType } from '../shared/enums';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 36, name: 'user_id' })
    userId: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column({ type: 'boolean', default: false, name: 'is_read' })
    isRead: boolean;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
        name: 'related_entity_type',
    })
    relatedEntityType: string;

    @Column({
        type: 'varchar',
        length: 36,
        nullable: true,
        name: 'related_entity_id',
    })
    relatedEntityId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true, name: 'read_at' })
    readAt: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
