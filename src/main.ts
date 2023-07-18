import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AUTH_PORT } from './constants/PORTS';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('Server');

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);

	const config = new DocumentBuilder()
		.setTitle('Random Encounter API')
		.setVersion('0.0.1')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/doc', app, document);

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true
	}));
	await app.listen(AUTH_PORT).finally(() => { logger.log(`Server running in port ${AUTH_PORT}`) })
}
bootstrap();
