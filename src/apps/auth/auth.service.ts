import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserBody, UpdateUserBody } from './middlewares/user.body';
import { randomUUID } from 'node:crypto';
import { CompleteUserDTO, UserDTO } from './dtos/user.dto';
import { AddressDTO } from 'src/apps/address/dtos/address.dto';
import { CreateAddressBody } from 'src/apps/address/middleware/address.body';
import { AuthDataDTO } from './dtos/authentication.dto';
import { AddressService } from '../address/address.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private addressService: AddressService
	) { }

	async createCompleteUser(user: CreateUserBody, address: CreateAddressBody,): Promise<CompleteUserDTO> {
		var createdUser: UserDTO = {} as UserDTO;
		var createdAddress: AddressDTO = {} as AddressDTO;

		await this.prisma.$transaction(async () => {
			createdAddress = await this.addressService.createAddress(address);

			user.addressId = createdAddress.id;
			createdUser = await this.createUser(user);
		});

		const createdCompleteUser: CompleteUserDTO = {
			user: createdUser,
			address: createdAddress,
		};

		return createdCompleteUser;
	}

	async createUser(user: CreateUserBody): Promise<UserDTO> {
		const createdUser: UserDTO = await this.prisma.user.create({
			data: {
				id: randomUUID(),
				name: user.name,
				email: user.email,
				password: user.password,
				role: user.role,
				addressId: user.addressId,
				authorized: false,
				refreshToken: ''
			},
			select: {
				id: true,
				createdAt: true,
				name: true,
				email: true,
				password: true,
				role: true,
				authorized: true,
				addressId: true,
			},
		});

		return createdUser;
	}

	async checkRefreshToken(email: string, refreshToken: string): Promise<{ refreshToken: string }> {
		try {
			var refreshTokenResponse: { refreshToken: string } = await this.prisma.user.findFirstOrThrow({
				select: {
					refreshToken: true
				},
				where: {
					email: email,
					refreshToken: refreshToken
				}
			})
		} catch (ex) {
			return undefined;
		}

		return refreshTokenResponse;
	}

	async makeLogin(email: string): Promise<AuthDataDTO> {
		try {
			var loginResponse: AuthDataDTO = await this.prisma.user.findFirst({
				select: {
					id: true,
					password: true,
					email: true,
					authorized: true,
				},
				where: {
					email: email
				}
			})
		} catch (ex) {
			return undefined;
		}

		return loginResponse;
	}

	async getCompleteUserById(id: string): Promise<CompleteUserDTO> {

		var completeUser: CompleteUserDTO = undefined;

		await this.prisma.$transaction(async () => {
			const user: UserDTO = await this.prisma.user.findUnique({
				select: {
					id: true,
					createdAt: true,
					name: true,
					email: true,
					password: true,
					role: true,
					authorized: true,
					addressId: true,
				},
				where: {
					id: id
				}
			})

			if (user) {
				const address: AddressDTO = await this.addressService.getAddress(user.addressId);

				completeUser = {
					user,
					address
				}
			}
		});

		return completeUser;
	}

	async getUserById(id: string): Promise<UserDTO> {

		var userList: UserDTO = await this.prisma.user.findUnique({
			select: {
				id: true,
				createdAt: true,
				name: true,
				email: true,
				password: true,
				role: true,
				authorized: true,
				addressId: true,
			},
			where: {
				id: id
			}
		})

		return userList;
	}

	async getCompleteUser(query: string): Promise<CompleteUserDTO[]> {

		var completeUserList: CompleteUserDTO[] = [];

		await this.prisma.$transaction(async () => {
			const userList: UserDTO[] = await this.prisma.user.findMany({
				select: {
					id: true,
					createdAt: true,
					name: true,
					email: true,
					password: true,
					role: true,
					authorized: true,
					addressId: true,
				},
				where: query 
					? {
						OR: [
							{
								id: {
									contains: query,
									mode: 'insensitive'
								},
							},
							{
								email: {
									contains: query,
									mode: 'insensitive'
								},
							},
							{
								name: {
									contains: query,
									mode: 'insensitive'
								},
							},
						]
					}
					: {}
			})

			await Promise.all(
				userList.map(async (user: UserDTO) => {
					const userAddress: AddressDTO = await this.addressService.getAddress(user.addressId);
					completeUserList.push({
						user: user,
						address: userAddress
					})

				})
			)

		});

		return completeUserList;
	}

	async getUser(query: string): Promise<UserDTO[]> {

		const userList: UserDTO[] = await this.prisma.user.findMany({
			select: {
				id: true,
				createdAt: true,
				name: true,
				email: true,
				password: true,
				role: true,
				authorized: true,
				addressId: true,
			},
			where: query 
				? {
					OR: [
						{
							id: {
								contains: query,
								mode: 'insensitive'
							},
						},
						{
							email: {
								contains: query,
								mode: 'insensitive'
							},
						},
						{
							name: {
								contains: query,
								mode: 'insensitive'
							},
						},
					]
				}
				: {}
		})

		return userList;
	}

	async updateUser(id: string, user: UpdateUserBody): Promise<UserDTO> {
		const updatedUser: UserDTO = await this.prisma.user.update({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
				role: user.role,
				refreshToken: user.refreshToken
			},
			where: {
				id: id,
			},
		});

		return updatedUser;
	}

}
