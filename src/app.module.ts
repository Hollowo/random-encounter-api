import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './apps/auth/auth.controller';
import { AuthService } from './apps/auth/auth.service';
import { AddressController } from './apps/address/address.controller';
import { AddressService } from './apps/address/address.service';
import { AdminController } from './apps/admin/admin.controller';
import { AdminService } from './apps/admin/admin.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './apps/auth/strategies/local.strategy';
import { LoginHandler } from './util/login.handler';
import { RefreshStrategy } from './apps/auth/strategies/refresh.strategy';
import { TableController } from './apps/table/table.controller';
import { TableService } from './apps/table/table.service';

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule,
		JwtModule.register({
			privateKey: process.env.SECRET_KEY,
			signOptions: { expiresIn: '60s' }
		})
	],
	controllers: [AuthController, AddressController, AdminController, TableController],
	providers: [
		PrismaService, AuthService, AddressService, AdminService, TableService,
		LocalStrategy, RefreshStrategy,
		LoginHandler
	],
})
export class AppModule {
	constructor(private configService: ConfigService) { }
}
