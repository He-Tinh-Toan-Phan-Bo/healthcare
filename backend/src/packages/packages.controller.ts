import { Controller, Get, Param } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @Public()
  async findAll() {
    const items = await this.packagesService.findAll();
    return {
      success: true,
      data: items,
      items: items // Some generic frontend maps might expect items
    };
  }

  @Get('popular')
  @Public()
  async findPopular() {
    const items = await this.packagesService.findPopular();
    return {
      success: true,
      data: items,
      items: items
    };
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    const items = await this.packagesService.findByCategory(category);
    return {
      success: true,
      data: items,
      items: items
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.packagesService.findOne(id);
    return {
      success: true,
      data: item,
      item: item
    };
  }
}
