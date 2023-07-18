import { Body, Controller, Post, Patch, Get, Param, Req, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompleteUserBody, UpdateUserBody } from './middlewares/user.body';
import { CompleteUserDTO, UserDTO } from './dtos/user.dto';
import { CreateLoginBody } from './middlewares/authentication.body';
import { TokenDTO } from './dtos/authentication.dto';
import { UserAlreadyExist, UserNotFoundException } from 'src/middlewares/HttpException';
import { EncoderHelper } from 'src/util/encoder.helper';
import { AuthGuard } from '@nestjs/passport';
import { LoginHandler } from 'src/util/login.handler';
import { ApiPropertyOptional, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication/User Management')
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

	@UseGuards(AuthGuard('refresh'))
	@ApiQuery({ required: false, name: 'query', description: 'User ID, Name or Email'})
	@Get('user')
	async getUser(query: string): Promise<CompleteUserDTO[]> {
		const completeUser: CompleteUserDTO[] = await this.authService.getUser(query);

		return completeUser;
	}

	@UseGuards(AuthGuard('refresh'))
	@Patch('user/:id')
	async updateUser(@Body() body: UpdateUserBody, @Param() params: any): Promise<UserDTO> {

		const { id } = params;
		const userToUpdate: CompleteUserDTO = await this.authService.getUserById(id);

		var createdUser: UserDTO = {} as UserDTO;
		if (userToUpdate) {

			if (body.password)
				body.password = await EncoderHelper.encode(body.password, 12)

			createdUser = await this.authService.updateUser(id, body);
		} else {
			throw new UserNotFoundException
		}

		return createdUser;
	}
}
