import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { User } from '@prisma/client';
import { CreateUserBody } from './dtos/user';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('user')
	async createUser(@Body() body: CreateUserBody) {
		const createdUser: User = await this.authService.createUser(body);

		return createdUser;
	}
}
