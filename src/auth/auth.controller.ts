import { Body, Controller, Post, Patch, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { CreateCompleteUserBody, UpdateUserBody } from './middlewares/user.body';
import { CompleteUserDTO, UserDTO } from './dtos/user.dto';
import { CreateLoginBody } from './middlewares/authentication.body';
import { TokenDTO } from './dtos/authentication.dto';
import { UserAlreadyExist, UserNotFoundException } from 'src/middlewares/HttpException';
import { EncoderHelper } from 'src/util/encoder.helper';
import { AuthGuard } from '@nestjs/passport';
import { LoginHandler } from 'src/util/login.handler';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private loginHandler: LoginHandler
	) { }

	@Post('user')
	async createCompleteUser(@Body() body: CreateCompleteUserBody): Promise<CompleteUserDTO> {

		const { user, address } = body;

		const existentUser: CompleteUserDTO[] = await this.authService.getUser(user.email);

		if (!existentUser.length) {

			user.password = await EncoderHelper.encode(user.password, 12)

			const createdCompleteUser: CompleteUserDTO = await this.authService.createCompleteUser(user, address);

			return createdCompleteUser;

		} else {
			throw new UserAlreadyExist;
		}
	}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async makeLogin(@Req() req, @Body() body: CreateLoginBody): Promise<TokenDTO> {
		if (req.user) {
			const tokenPayload: TokenDTO = await this.loginHandler.generateJwtToken(req.user)

			const { refreshToken } = tokenPayload;

			await this.authService.updateUser(req.user.id, { refreshToken } as UpdateUserBody)

			return tokenPayload;
		}
	}

	@UseGuards(AuthGuard('local'))
	@Get(['user/:query', 'user'])
	async getUser(@Param() params: any): Promise<CompleteUserDTO[]> {
		console.log('aaa')
		const query = params.query;
		const completeUser: CompleteUserDTO[] = await this.authService.getUser(query);

		return completeUser;
	}

	@UseGuards(AuthGuard('local'))
	@Patch('user/:id')
	async updateUser(@Body() body: UpdateUserBody, @Param() params: any): Promise<UserDTO> {

		const { id } = params;
		const userToUpdate: CompleteUserDTO = await this.authService.getUserById(id);

		var createdUser: UserDTO = {} as UserDTO;
		if (userToUpdate) {
			createdUser = await this.authService.updateUser(id, body);
		} else {
			throw new UserNotFoundException
		}

		return createdUser;
	}
}
