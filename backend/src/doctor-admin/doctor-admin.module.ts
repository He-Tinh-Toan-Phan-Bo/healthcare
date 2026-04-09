import { Module } from '@nestjs/common';
import { DoctorAdminController } from './doctor-admin.controller';
import { DoctorAdminService } from './doctor-admin.service';

@Module({
    controllers: [DoctorAdminController],
    providers: [DoctorAdminService],
})
export class DoctorAdminModule { }
