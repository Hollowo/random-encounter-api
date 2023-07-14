import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/service/auth.service';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/service/address.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { LoginHandler } from './util/login.handler';

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule,
		JwtModule.register({
			privateKey: process.env.SECRET_KEY,
			signOptions: { expiresIn: '60s' }
		})
	],
	controllers: [AuthController, AddressController, AdminController],
	providers: [
		PrismaService, AuthService, AddressService, AdminService,
		LocalStrategy,
		LoginHandler],
})
export class AuthModule {
	constructor(private configService: ConfigService) { }
}
