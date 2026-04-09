import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { QueryAdminUsersDto } from './dto/query-admin-users.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { CreateClinicAdminDto } from './dto/create-clinic-admin.dto';
import { UpdateClinicAdminDto } from './dto/update-clinic-admin.dto';
import { CreateDoctorAdminDto } from './dto/create-doctor-admin.dto';
import { UpdateDoctorAdminDto } from './dto/update-doctor-admin.dto';
import { CreateArticleAdminDto } from './dto/create-article-admin.dto';
import { UpdateArticleAdminDto } from './dto/update-article-admin.dto';

@ApiTags('System Admin')
@ApiBearerAuth('JWT')
@Roles(UserRole.ADMIN)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    listUsers(@Query() query: QueryAdminUsersDto) {
        return this.adminService.listUsers(query);
    }

    @Post('users')
    createUser(@Body() dto: CreateAdminUserDto) {
        return this.adminService.createUser(dto);
    }

    @Patch('users/:id')
    updateUser(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
        return this.adminService.updateUser(id, dto);
    }

    @Delete('users/:id')
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @Get('clinics')
    listClinics() {
        return this.adminService.listClinics();
    }

    @Post('clinics')
    createClinic(@Body() dto: CreateClinicAdminDto) {
        return this.adminService.createClinic(dto);
    }

    @Patch('clinics/:id')
    updateClinic(@Param('id') id: string, @Body() dto: UpdateClinicAdminDto) {
        return this.adminService.updateClinic(id, dto);
    }

    @Delete('clinics/:id')
    deleteClinic(@Param('id') id: string) {
        return this.adminService.deleteClinic(id);
    }

    @Get('doctors')
    listDoctors() {
        return this.adminService.listDoctors();
    }

    @Post('doctors')
    createDoctor(@Body() dto: CreateDoctorAdminDto) {
        return this.adminService.createDoctor(dto);
    }

    @Patch('doctors/:id')
    updateDoctor(@Param('id') id: string, @Body() dto: UpdateDoctorAdminDto) {
        return this.adminService.updateDoctor(id, dto);
    }

    @Delete('doctors/:id')
    deleteDoctor(@Param('id') id: string) {
        return this.adminService.deleteDoctor(id);
    }

    @Get('articles')
    listArticles() {
        return this.adminService.listArticles();
    }

    @Post('articles')
    createArticle(@Body() dto: CreateArticleAdminDto) {
        return this.adminService.createArticle(dto);
    }

    @Patch('articles/:id')
    updateArticle(@Param('id') id: string, @Body() dto: UpdateArticleAdminDto) {
        return this.adminService.updateArticle(id, dto);
    }

    @Delete('articles/:id')
    deleteArticle(@Param('id') id: string) {
        return this.adminService.deleteArticle(id);
    }
}
