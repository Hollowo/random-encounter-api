import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/service/auth.service';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/service/address.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PORT } from './constants/PORTS';
import { ObservableUtil } from './util/observableUtil';
import * as net from 'net';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ClientsModule.register([{
			name:  'AUTH_MICROSERVICE', 
			options: { 
				transport: Transport.TCP,
				port: 3001
			} 
		}])
	],
	controllers: [AuthController, AddressController, AdminController],
	providers: [PrismaService, AuthService, AddressService, AdminService, ObservableUtil,
	{
		provide: 'TcpServerService',
		useFactory: () => {
			const server = net.createServer(socket => {
				socket.write('TCP PROVIDER\n');
				socket.pipe(socket);
			});
			server.listen()

			return server;
		}
	}],
})
export class AuthModule { 
	constructor(private configService: ConfigService){}
}
