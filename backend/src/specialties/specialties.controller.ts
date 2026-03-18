import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { SpecialtiesService } from './specialties.service';

@ApiTags('Specialties')
@Controller({ path: 'specialties', version: '1' })
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Public()
  @Get()
  list() {
    return this.specialtiesService.list();
  }
}

