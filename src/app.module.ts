import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/service/auth.service';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/service/address.service';

@Module({
	imports: [],
	controllers: [AuthController, AddressController],
	providers: [PrismaService, AuthService, AddressService],
})
export class AppModule { }
