import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ADDRESS_PORT, AUTH_PORT } from './constants/PORTS';

const logger = new Logger('Microservice');

async function bootstrap() {
	const app = await NestFactory.createMicroservice(
		AuthModule,
		{
			options: {
				transport: Transport.TCP,
				port: AUTH_PORT
			}
		});
	app.useGlobalPipes(new ValidationPipe());
	await app.listen().catch((ex) => { throw ex }).finally(() => {
		logger.log(`Server started in ports: [AUTH] ${AUTH_PORT}
										     
		`);
	});
}
bootstrap();
