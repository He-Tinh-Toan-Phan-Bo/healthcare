import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryArticlesDto } from './dto/query-articles.dto';

const publicArticleSelect = {
  id: true,
  title: true,
  description: true,
  image: true,
  category: true,
  readTime: true,
  slug: true,
  publishedAt: true,
} as const;

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(dto: QueryArticlesDto) {
    const page = dto.page ?? 1;
    const limit = Math.min(dto.limit ?? 12, 50);
    const skip = (page - 1) * limit;

    const where = {
      ...(dto.category ? { category: dto.category } : {}),
      ...(dto.q
        ? {
            OR: [
              { title: { contains: dto.q, mode: 'insensitive' as const } },
              {
                description: {
                  contains: dto.q,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: publicArticleSelect,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
    };
  }

  async listFeatured(limit = 3) {
    const take = Number.isFinite(limit)
      ? Math.max(1, Math.min(Math.floor(limit), 12))
      : 3;

    const items = await this.prisma.article.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take,
      select: publicArticleSelect,
    });

    return { items };
  }

  async listByCategory(category: string, limit = 12) {
    const take = Number.isFinite(limit)
      ? Math.max(1, Math.min(Math.floor(limit), 50))
      : 12;

    const items = await this.prisma.article.findMany({
      where: { category },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take,
      select: publicArticleSelect,
    });

    return { items };
  }

  async listCategories() {
    const rows = await this.prisma.article.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    const items = rows
      .map((row) => row.category)
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b, 'vi'));

    return { items };
  }

  async getBySlug(slug: string) {
    const item = await this.prisma.article.findUnique({
      where: { slug },
      select: publicArticleSelect,
    });

    if (!item) {
      throw new NotFoundException({
        code: 'ARTICLE_NOT_FOUND',
        message: 'Article not found',
      });
    }

    return item;
  }
}
