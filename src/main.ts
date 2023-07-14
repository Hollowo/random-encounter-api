import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AUTH_PORT } from './constants/PORTS';

const logger = new Logger('Server');

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true
	}));
	await app.listen(AUTH_PORT).finally(() => { logger.log(`Server running in port ${AUTH_PORT}`) })
}
bootstrap();
