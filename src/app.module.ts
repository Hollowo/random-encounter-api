import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/service/auth.service';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/service/address.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
	imports: [],
	controllers: [AuthController, AddressController, AdminController],
	providers: [PrismaService, AuthService, AddressService, AdminService],
})
export class AppModule { }
