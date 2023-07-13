import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserBody, UpdateUserBody } from '../middlewares/user';
import { randomUUID } from 'node:crypto';
import { CompleteUserDTO, UserDTO } from '../dtos/user';
import { AddressDTO } from 'src/address/dtos/address';
import { CreateAddressBody } from 'src/address/middleware/address';
import { AddressService } from 'src/address/service/address.service';
import { AuthDataDTO } from '../dtos/authentication';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, map } from 'rxjs';
import { ObservableUtil } from 'src/util/observableUtil';

@Injectable()
export class AuthService {
	constructor(
		@Inject('AUTH_MICROSERVICE')  private readonly client: ClientProxy,
		private prisma: PrismaService,
		private addressService: AddressService,
		private observer: ObservableUtil
	) { }

	async createCompleteUser(user: CreateUserBody,address: CreateAddressBody,): Promise<CompleteUserDTO> {
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

		return this.observer.observe({ cmd: 'create-complete-user' }, createdCompleteUser, this.client);
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
				access_token: ''
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

	async makeLogin(email, password): Promise<AuthDataDTO> {
		const loginResponse: AuthDataDTO = await this.prisma.user.findFirst({
			select: {
				id: true,
				authorized: true,
				access_token: true,
			},
			where: {
				email: email,
				password: password
			}
		})

		return loginResponse;
	}

	async getUserById(id: string): Promise<CompleteUserDTO> {

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

	async getUser(query: string): Promise<CompleteUserDTO[]> {

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
				where: {
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

	async updateUser(id: string, user: UpdateUserBody): Promise<UserDTO> {
		const updatedUser: UserDTO = await this.prisma.user.update({
			data: {
				name: user.name,
				email: user.email,
			    password: user.password,
				role: user.role,

			},
			where: {
				id: id,
			},
		});

		return updatedUser;
	}

}
