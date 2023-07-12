import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCompleteUserBody, CreateUserBody } from '../middlewares/user';
import { randomUUID } from 'node:crypto'
import { CompleteUserDTO, UserDTO } from '../dtos/user';
import { AddressDTO } from 'src/address/dtos/address';
import { CreateAddressBody } from 'src/address/middleware/address';
import { AddressService } from 'src/address/service/address.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private addressService: AddressService
	) { }

	async createCompleteUser(user: CreateUserBody, address: CreateAddressBody): Promise<CompleteUserDTO> {

		var createdUser: UserDTO = {} as UserDTO;
		var createdAddress: AddressDTO = {} as AddressDTO;

		this.prisma.$transaction(async () => {
			createdUser = await this.createUser(user);
			createdAddress = await this.addressService.createAddress(address);
		})

		const createdCompleteUser: CompleteUserDTO = {
			user: createdUser,
			address: createdAddress
		}

		return createdCompleteUser;
	}

	async createUser(user: CreateUserBody): Promise<UserDTO> {
		const createdUser: UserDTO = await this.prisma.user.create({
			data: {
				id: randomUUID(),
				name: user.name,
				email: user.email,
				role: user.role,
				addressId: user.addressId
			},
			select: {
				id: true,
				createdAt: true,
				name: true,
				email: true,
				role: true,
				addressId: true,
			},
		});

		return createdUser;
	}

	async updateUser(id: string, user: CreateUserBody): Promise<UserDTO> {
		const updatedUser: UserDTO = await this.prisma.user.update({
			data: {
				name: user.name,
				email: user.email,
				role: user.role,
				addressId: user.addressId
			},
			where: {
				id: id
			}
		})

		return updatedUser;
	}

	async createCountry(country: any) {
		const createdCountry = await this.prisma.country.create({
			data: {
				id: country.id,
				name: country.name,
				flag: country.flag
			},
			select: {
				id: true
			}
		})

		return createdCountry;
	}

	async getCountry(name: string) {
		const country = await this.prisma.country.findFirst({
			select: {
				id: true,
			},
			where: {
				name: {
					equals: name
				}
			}
		})

		return country;
	}

	async createState(state: any) {
		const createdState = await this.prisma.province.create({
			data: {
				id: state.id,
				name: state.name,
				countryId: state.countryId
			},
			select: {
				id: true
			}
		})

		return createdState;
	}

	async createCity(city: any) {
		const createdCity = await this.prisma.city.create({
			data: {
				id: city.id,
				name: city.name,
				provinceId: city.provinceId
			},
			select: {
				id: true
			}
		})

		return createdCity
	}
}
