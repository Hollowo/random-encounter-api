import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { CreateCompleteUserBody, CreateUserBody } from './middlewares/user';
import { CompleteUserDTO, UserDTO } from './dtos/user';
import { AddressDTO } from 'src/address/dtos/address';
import { AddressService } from 'src/address/service/address.service';
import { randomUUID } from 'node:crypto';
import axios from 'axios';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
	) { }

	@Post('/register')
	async registerRegions() {
		const countries: any[] = (await axios.get('https://restcountries.com/v3.1/all')).data;
		const formattedCountries: any = await countries.map(country => (
			{
				id: randomUUID(),
				name: country.name.common,
				flag: `:flag_${country.cca2.toLowerCase()}:`,
				code: country.cca2
			}
		))

		const key = 'free'

		formattedCountries.forEach(async (country) => {
			if (!await this.authService.getCountry(country.name)) {
				const countryId = (await this.authService.createCountry(country)).id;
				const url = `http://api.geonames.org/searchJSON?&country=${country.code}&featureClass=P&username=${key}&maxRows=1`
				const data = (await axios.get(url)).data
				if (data.value === 19) {
					return 'cabo o token';
				}
				const totalResult = data.totalResultsCount
				const loopTimes = totalResult / 1000
				if (!data.geonames || !data.geonames.length) {
					return;
				}
				for (let startRow = 0; startRow < Math.round(loopTimes); startRow += 1000) {
					const cities = (await axios.get(`http://api.geonames.org/searchJSON?&country=${country.code}&featureClass=P&username=${key}&maxRows=1000&startRow=${startRow}`)).data.geonames

					const states = []
					cities.forEach(city => {
						if (!states.includes(city.adminName1)) {
							if (!city.adminName1) {
								console.log(city)
							}

							states.push({
								id: randomUUID(),
								name: city.adminName1,
								countryId: countryId
							})
						}
					})

					states.forEach(async state => {
						const stateId = (await this.authService.createState(state)).id;

						cities.filter(city => city.adminName1 === state.name).forEach(async city => {
							const formattedCity = {
								id: randomUUID(),
								name: city.name,
								provinceId: stateId
							}

							await this.authService.createCity(formattedCity)
						})
					})
				}
			}
		})

		return 'feito :D'
	}

	@Post('user')
	async createCompleteUser(@Body() body: CreateCompleteUserBody): Promise<CompleteUserDTO> {
		const { user, address } = body;

		const createdCompleteUser: CompleteUserDTO = await this.authService.createCompleteUser(user, address);

		return createdCompleteUser;
	}

	@Patch('user/:id')
	async updateUser(@Body() body: CreateUserBody, @Param() params: any): Promise<UserDTO> {
		const id = params.id;

		const createdUser: UserDTO = await this.authService.updateUser(id, body);

		return createdUser;
	}
}
