import { Body, Controller, Post, Patch, Get, Param } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { CreateCompleteUserBody, CreateUserBody } from './middlewares/user';
import { CompleteUserDTO, UserDTO } from './dtos/user';
import { randomUUID } from 'node:crypto';
import { citiesJson, countriesJson, statesJson } from '../admin/countries';
import { PrismaService } from 'src/database/prisma.service';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private prisma: PrismaService
	) { }

	@Post('user')
	async createCompleteUser(@Body() body: CreateCompleteUserBody): Promise<CompleteUserDTO> {

		const { user, address } = body;

		const createdCompleteUser: CompleteUserDTO = await this.authService.createCompleteUser(user, address);

		return createdCompleteUser;
	}

	@Get('user/:query')
	async getUser(@Param() params: any): Promise<CompleteUserDTO[]> {

		const query = params.query;

		const completeUser: CompleteUserDTO[] = await this.authService.getUser(query);

		return completeUser;
	}

	@Patch('user/:id')
	async updateUser(@Body() body: CreateUserBody, @Param() params: any): Promise<UserDTO> {

		const id = params.id;

		const createdUser: UserDTO = await this.authService.updateUser(id, body);

		return createdUser;
	}
}
