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
import { AuthModule } from './apps/auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule,
		AuthModule
	],
	controllers: [AddressController, AdminController, TableController],
	providers: [
		PrismaService, AuthService, AddressService, AdminService, TableService,
		LocalStrategy, RefreshStrategy,
	],
})
export class AppModule {
	constructor(private configService: ConfigService) { }
}
