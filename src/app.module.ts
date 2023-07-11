import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './database/prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/service/auth.service';

@Module({
	imports: [],
	controllers: [AppController, AuthController],
	providers: [PrismaService, AuthService],
})
export class AppModule {}
