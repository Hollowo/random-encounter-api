import { Body, Controller, Post, Patch, Get, Param, Res, UnauthorizedException, HttpException } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { CreateCompleteUserBody, UpdateUserBody } from './middlewares/user';
import { CompleteUserDTO, UserDTO } from './dtos/user';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLoginBody } from './middlewares/authentication';
import { AuthDataDTO } from './dtos/authentication';

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

	@Post('login')
	async makeLogin(@Res() res: any, @Body() body: CreateLoginBody): Promise<AuthDataDTO> {

		const { email, password } = body;
		const loginAttemptResponse: AuthDataDTO = await this.authService.makeLogin(email, password);

		if (loginAttemptResponse) {
			return loginAttemptResponse;
		} else {
			throw new HttpException('Invalid credentials or user not found with provided password', 404);
		}
	}

	@Get('user/:query')
	async getUser(@Param() params: any): Promise<CompleteUserDTO[]> {

		const query = params.query;
		const completeUser: CompleteUserDTO[] = await this.authService.getUser(query);

		return completeUser;
	}

	@Patch('user/:id')
	async updateUser(@Body() body: UpdateUserBody, @Param() params: any): Promise<UserDTO> {

		const id = params.id;
		const userToUpdate: CompleteUserDTO = await this.authService.getUserById(id);

		var createdUser: UserDTO = {} as UserDTO;
		if (userToUpdate) {
			console.log(userToUpdate)
			createdUser = await this.authService.updateUser(id, body);
		} else {
			throw new HttpException('User not found', 404)
		}

		return createdUser;
	}
}
