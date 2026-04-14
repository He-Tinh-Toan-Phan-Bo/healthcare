import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 500 })
    title: string;

    @Column({ type: 'varchar', length: 500, unique: true })
    slug: string;

    @Column({ type: 'text' })
    excerpt: string;

    @Column({ type: 'longtext' })
    content: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    image: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'category_id' })
    categoryId: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'author_id' })
    authorId: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'read_time' })
    readTime: string;

    @Column({ type: 'timestamp', nullable: true, name: 'published_at' })
    publishedAt: Date;

    @Column({ type: 'json', nullable: true })
    tags: string[];

    @Column({ type: 'int', default: 0, name: 'view_count' })
    viewCount: number;

    @Column({ type: 'boolean', default: false, name: 'is_featured' })
    isFeatured: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations
    @ManyToOne(() => Category, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: User;
}
