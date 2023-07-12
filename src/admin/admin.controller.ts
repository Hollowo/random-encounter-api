import { Body, Controller, Get, Post, Patch, Param, ConsoleLogger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/database/prisma.service';
import { brazilCities, citiesJson, countriesJson, statesJson } from './countries';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
	constructor(
		private adminService: AdminService,
		private prisma: PrismaService
	) { }

    @Post('/brazil')
    async fixBrazilRegions() {

        const getStateUUID = (uf: string) => {
            switch (uf.toLowerCase()) {
                case 'pb':
                  return '3ee141bd-d2fb-4d68-bf16-a80cedadae3e';
                case 'ba':
                  return '1feb8ad7-c889-45c4-bb8a-399ad2f55d02';
                case 'sp':
                  return 'f54cbb8f-2186-48b3-bd18-4312ba4c1c54';
                case 'rr':
                  return '2dfdf276-4143-4809-b949-4f94cbf2165c';
                case 'ac':
                  return '9db05658-5c69-4914-9605-234f6e67b2cb';
                case 'al':
                  return 'd41b8863-4ef0-4056-b61c-76a0eebd3c84';
                case 'rn':
                  return 'de84644d-eb39-4694-841d-257d32ad1fe4';
                case 'ap':
                  return '652f50a1-5b9e-459f-8e96-69adb222dd0d';
                case 'es':
                  return 'ab32f77f-359a-435d-87e3-3c7d35a71b1f';
                case 'ms':
                  return '6a2cfab1-8316-496b-97a0-1415dbbe1664';
                case 'ma':
                  return 'c972eb97-12c4-4a61-9087-d352b5364219';
                case 'pi':
                  return '63c36ecc-2b0a-4979-af87-f0e146c2c16f';
                case 'rs':
                  return '8834eb18-81de-4439-b2e7-efb38913c8b7';
                case 'ro':
                  return 'a430495a-7285-4cc9-8abe-78bdddb13d0c';
                case 'pe':
                  return '4f483684-95b7-4990-a929-597412c626c3';
                case 'ce':
                  return '00770f0a-6f7b-4934-8041-ee255a214f92';
                case 'pa':
                  return 'fe5435c3-0c2a-4ee6-b877-ec19e0f1b2f8';
                case 'sc':
                  return 'd20fed28-d7bd-4b77-8681-154b5cf5979d';
                case 'df':
                  return '558acda7-3bce-4a3a-a42c-b095656d8e07';
                case 'pr':
                  return 'ef164a6c-131a-476c-b81e-1f6ba8febeff';
                case 'to':
                  return '37c4736e-7559-475b-9caa-d804abd6454e';
                case 'se':
                  return '37681f7a-7edd-448f-948a-3872b8459479';
                case 'go':
                  return '696ce49c-2191-45e5-9475-a3f897411d15';
                case 'am':
                  return '4bbdfa7c-a389-4f8e-80ec-9ad61e23994b';
                case 'mg':
                  return 'a1c206e9-6456-4260-aa47-25be9bab8e47';
                case 'rj':
                  return '5a58063f-7942-4a06-a2b9-c178461d2131';
                case 'mt':
                  return '83268413-c774-4f20-98a0-fd67f72e6a5f';
                default:
                  return null;
              }
        }

        brazilCities.forEach(async city => {
            const cityForm = {
                id: randomUUID(),
                name: city.name,
                provinceId: getStateUUID(city.uf)
            }

            await this.adminService.createCity(cityForm);
        })

        return brazilCities.length
    }

	@Post('/register')
	async registerRegions() {
	
		var citiesControl = citiesJson.cities;

		await this.prisma.$transaction(async () => {
			countriesJson.countries.forEach(async country => {
				const countryUUID = randomUUID();
	
				const countryForm = {
					id: countryUUID,
					name: country.name,
					flag: `:flag_${country.sortname.toLowerCase()}:`
				}
	
				await this.adminService.createCountry(countryForm);
	
				console.log(`${country.name}: `)
	
				statesJson.states.filter(state => state.country_id === country.id.toString()).forEach(async state => {
					const stateUUID = randomUUID();
	
					const stateForm  = {
						id: stateUUID,
						name: state.name,
						countryId: countryUUID
					}
	
					await this.adminService.createState(stateForm);
	
					console.log(`	${state.name}: `)
	
					citiesJson.cities.filter(city => city.state_id === state.id).forEach(async city => {

						const cityUUID = randomUUID();
	
						const cityForm  = {
							id: cityUUID,
							name: city.name,
							provinceId: stateUUID,
							provinceId_alt: city.id
						}
	
						console.log(`		${city.name} `)
	
						
						try {
							var existentCity = await this.adminService.getCity(city.name, state.id);
							if (!existentCity) {
								await this.adminService.createCity(cityForm);
								citiesControl.splice(citiesControl.indexOf(city), 1)
							}
						} catch (ex) {
							console.log(cityForm)
							throw ex;
						}
					})
				})
			})
		})
		return citiesControl;
	}
}
