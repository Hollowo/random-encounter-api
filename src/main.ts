import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AUTH_PORT } from './constants/PORTS';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('Server');

async function bootstrap() {
	const app: INestApplication = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Random Encounter API')
		.setVersion('0.0.1')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: {
			supportedSubmitMethods: []
		}
	});

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true
	}));
	await app.listen(AUTH_PORT).finally(() => { logger.log(`Server running in port ${AUTH_PORT}`) })
}
bootstrap();
