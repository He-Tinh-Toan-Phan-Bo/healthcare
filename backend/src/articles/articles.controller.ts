import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ArticlesService } from './articles.service';
import { QueryArticlesDto } from './dto/query-articles.dto';

@ApiTags('Articles')
@Controller({ path: 'articles', version: '1' })
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get()
  list(@Query() query: QueryArticlesDto) {
    return this.articlesService.list(query);
  }

  @Public()
  @Get('categories')
  categories() {
    return this.articlesService.listCategories();
  }

  @Public()
  @Get('featured')
  featured(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.articlesService.listFeatured(parsedLimit);
  }

  @Public()
  @Get('category/:category')
  byCategory(
    @Param('category') category: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.articlesService.listByCategory(category, parsedLimit);
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.articlesService.getBySlug(slug);
  }
}
