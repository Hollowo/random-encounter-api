import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCompleteUserBody, CreateUserBody } from '../middlewares/user';
import { randomUUID } from 'node:crypto';
import { CompleteUserDTO, UserDTO } from '../dtos/user';
import { AddressDTO } from 'src/address/dtos/address';
import { CreateAddressBody } from 'src/address/middleware/address';
import { AddressService } from 'src/address/service/address.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private addressService: AddressService,
	) {}

	async createCompleteUser(
		user: CreateUserBody,
		address: CreateAddressBody,
	): Promise<CompleteUserDTO> {
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

		console.log('complete', createdCompleteUser.user)

		return createdCompleteUser;
	}

	async createUser(user: CreateUserBody): Promise<UserDTO> {
		const createdUser: UserDTO = await this.prisma.user.create({
			data: {
				id: randomUUID(),
				name: user.name,
				email: user.email,
				role: user.role,
				addressId: user.addressId,
				authorized: false
			},
			select: {
				id: true,
				createdAt: true,
				name: true,
				email: true,
				role: true,
				authorized: true,
				addressId: true,
			},
		});

		return createdUser;
	}

	async getUser(query: string): Promise<CompleteUserDTO[]> {

		var completeUserList: CompleteUserDTO[] = [{} as CompleteUserDTO];
		
		await this.prisma.$transaction(async () => {
			const userList: UserDTO[] = await this.prisma.user.findMany({
				select: {
					id: true,
					createdAt: true,
					name: true,
					email: true,
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
						{
							name: { 
								contains: query,
								mode: 'insensitive'
							},
						},
					]
				}
			})

			userList.forEach(async (user: UserDTO) => {
				const userAddress: AddressDTO = await this.addressService.getAddress(user.addressId);

				completeUserList.push({
					user: user,
					address: userAddress
				})
			})
		});
		
		return completeUserList;
	}

	async updateUser(id: string, user: CreateUserBody): Promise<UserDTO> {
		const updatedUser: UserDTO = await this.prisma.user.update({
			data: {
				name: user.name,
				email: user.email,
				role: user.role,
				addressId: user.addressId,
			},
			where: {
				id: id,
			},
		});

		return updatedUser;
	}

}
