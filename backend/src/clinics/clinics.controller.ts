import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ClinicsService } from './clinics.service';
import { QueryClinicsDto } from './dto/query-clinics.dto';

@ApiTags('Clinics')
@Controller({ path: 'clinics', version: '1' })
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Public()
  @Get()
  list(@Query() query: QueryClinicsDto) {
    return this.clinicsService.list(query);
  }

  @Public()
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.clinicsService.getById(id);
  }
}

