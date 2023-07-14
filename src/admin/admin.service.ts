import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'node:crypto';
import { AddressDTO } from 'src/address/dtos/address.dto';
import { CreateAddressBody } from 'src/address/middleware/address.body';
import { AddressService } from 'src/address/service/address.service';

@Injectable()
export class AdminService {
	constructor(
		private prisma: PrismaService,
		private addressService: AddressService,
	) { }

	async createCountry(country: any) {
		const createdCountry = await this.prisma.country.create({
			data: {
				id: country.id,
				name: country.name,
				flag: country.flag,
			},
			select: {
				id: true,
			},
		});

		return createdCountry;
	}

	async getCountry(name: string) {
		const country = await this.prisma.country.findFirst({
			select: {
				id: true,
				name: true,
				flag: true
			},
			where: {
				name: {
					equals: name,
				},
			},
		});

		return country;
	}

	async createState(state: any) {
		const createdState = await this.prisma.province.create({
			data: {
				id: state.id,
				name: state.name,
				countryId: state.countryId,
			},
			select: {
				id: true,
				name: true,
				countryId: true,
			},
		});

		return createdState;
	}

	async getState(name: string, countryId: string) {
		const state = await this.prisma.province.findFirst({
			select: {
				id: true,
				name: true,
			},
			where: {
				name: {
					equals: name,
				},
				AND: {
					countryId: {
						equals: countryId
					}
				}
			},
		});

		return state;
	}

	async listAllCities() {
		return await this.prisma.city.findMany({
			select: {
				id: true,
				name: true,
				provinceId: true,
			}
		});
	}

	async getCity(name: string, stateId: string) {
		const state = await this.prisma.city.findFirst({
			select: {
				id: true,
				name: true,
			},
			where: {
				name: {
					equals: name,
				},
				AND: {
					provinceId: {
						equals: stateId
					}
				}
			},
		});

		return state;
	}

	async createCity(city: any) {
		const createdCity = await this.prisma.city.create({
			data: {
				id: city.id,
				name: city.name,
				provinceId: city.provinceId,
			},
			select: {
				id: true,
				name: true,
				provinceId: true,
			},
		});

		return createdCity;
	}
}
