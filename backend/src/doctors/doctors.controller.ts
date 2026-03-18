import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { DoctorsService } from './doctors.service';
import { QueryDoctorsDto } from './dto/query-doctors.dto';

@ApiTags('Doctors')
@Controller({ path: 'doctors', version: '1' })
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Public()
  @Get()
  list(@Query() query: QueryDoctorsDto) {
    return this.doctorsService.list(query);
  }
}

