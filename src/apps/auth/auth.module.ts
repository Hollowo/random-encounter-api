import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from './auth.service';
import { AddressService } from '../address/address.service';
import { AdminService } from '../admin/admin.service';
import { TableService } from '../table/table.service';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginHandler } from 'src/util/login.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports:[
        ConfigModule.forRoot(),
		JwtModule.register({
			privateKey: process.env.SECRET_KEY,
			signOptions: { expiresIn: '7 days' }
		}),
    ],
    controllers: [AuthController],
	providers: [
		PrismaService, AuthService, AddressService, AdminService, TableService,
		LocalStrategy, RefreshStrategy,
		LoginHandler
	],
})
export class AuthModule {
    constructor(private configService: ConfigService) { }
}
