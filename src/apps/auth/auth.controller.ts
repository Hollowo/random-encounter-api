import { Body, Controller, Post, Patch, Get, Param, Req, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompleteUserBody, UpdateUserBody } from './middlewares/user.body';
import { CompleteUserDTO, UserDTO } from './dtos/user.dto';
import { CreateLoginBody } from './middlewares/authentication.body';
import { TokenDTO } from './dtos/authentication.dto';
import { UserAlreadyExistException, UserNotFoundException } from 'src/middlewares/http.exception';
import { EncoderHelper } from 'src/util/encoder.helper';
import { AuthGuard } from '@nestjs/passport';
import { LoginHandler } from 'src/util/login.handler';
import { ApiPropertyOptional, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication/User Management')
export class AuthController {
	constructor(
		private authService: AuthService,
		private loginHandler: LoginHandler
	) { }

	@ApiResponse({ status: 201, type: CompleteUserDTO })
	@Post('user')
	async createCompleteUser(@Body() body: CreateCompleteUserBody): Promise<CompleteUserDTO> {
		console.log(body)
		const { user, address } = body;

		const existentUser: CompleteUserDTO[] = await this.authService.getCompleteUser(user.email);

		if (!existentUser.length) {

			user.password = await EncoderHelper.encode(user.password, 12)

			const createdCompleteUser: CompleteUserDTO = await this.authService.createCompleteUser(user, address);

			return createdCompleteUser;
		} else {
			throw new UserAlreadyExistException;
		}
	}

	@ApiResponse({ status: 201, type: TokenDTO })
	@UseGuards(AuthGuard('local'))
	@Post('login')
	async makeLogin(@Req() req: any, @Body() body: CreateLoginBody): Promise<TokenDTO> {
		if (req.user) {
			const tokenPayload: TokenDTO = await this.loginHandler.generateJwtToken(req.user)

			const { refreshToken } = tokenPayload;
			await this.authService.updateUser(req.user.id, { refreshToken } as UpdateUserBody)

			return tokenPayload;
		}
	}

	@ApiResponse({ status: 201, type: UserDTO })
	@UseGuards(AuthGuard('refresh'))
	@Patch('user/:userId')
	async updateUser(@Body() body: UpdateUserBody, @Param('userId') userId: any): Promise<UserDTO> {

		const userToUpdate: CompleteUserDTO = await this.authService.getCompleteUserById(userId);

		var createdUser: UserDTO = {} as UserDTO;
		if (userToUpdate) {

			if (body.password)
				body.password = await EncoderHelper.encode(body.password, 12)

			createdUser = await this.authService.updateUser(userId, body);
		} else {
			throw new UserNotFoundException
		}

		return createdUser;
	}

	@ApiQuery({ required: false, name: 'query', description: 'User ID, Name or Email'})
	@ApiResponse({ status: 200, type: CompleteUserDTO, isArray: true })
	@UseGuards(AuthGuard('refresh'))
	@Get('complete-user')
	async getCompleteUser(@Query('query') query: string): Promise<CompleteUserDTO[]> {
		return await this.authService.getCompleteUser(query);
	}

	@ApiQuery({ required: false, name: 'query', description: 'User ID, Name or Email'})
	@ApiResponse({ status: 200, type: UserDTO, isArray: true })
	@UseGuards(AuthGuard('refresh'))
	@Get('user')
	async getUser(@Query('query') query: string): Promise<UserDTO[]> {
		return await this.authService.getUser(query);
	}

}
