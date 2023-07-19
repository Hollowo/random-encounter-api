import { Body, Controller, Get, Post, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AddressDTO, CityDTO, CountryDTO, ProvinceDTO } from 'src/apps/address/dtos/address.dto';
import { CreateAddressBody } from './middleware/address.body';
import { AddressService } from './address.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('address')
@UseGuards(AuthGuard('refresh'))
@ApiTags('Address')
export class AddressController {
    constructor(
        private addressService: AddressService
    ) { }

	@ApiResponse({ status: 201, type: AddressDTO })
    @Post()
    async createAddress(@Body() body: CreateAddressBody): Promise<AddressDTO> {

        const createdAddress: AddressDTO = await this.addressService.createAddress(body)

        return createdAddress;
    }

	@ApiResponse({ status: 201, type: AddressDTO })
    @Patch('/:id')
    async updateAddress(@Body() body: CreateAddressBody, @Param() params: any): Promise<AddressDTO> {

        const id = params.id;

        const updatedAddress: AddressDTO = await this.addressService.updateAddress(id, body);

        return updatedAddress;
    }

	@ApiResponse({ status: 200, type: CityDTO, isArray: true })
    @Get('city')
    async getCities(@Query('name') name: string, @Query('province') province: string): Promise<CityDTO[]> {

        const cityList: CityDTO[] = await this.addressService.getCities(name, province);

        return cityList;
    }

	@ApiResponse({ status: 200, type: ProvinceDTO, isArray: true })
    @Get('province')
    async getProvincies(@Query('name') name: string, @Query('country') country: string): Promise<ProvinceDTO[]> {

        const provinceList: ProvinceDTO[] = await this.addressService.getProvincies(name, country);

        return provinceList;
    }

	@ApiResponse({ status: 200, type: CountryDTO, isArray: true })
    @Get('country')
    async getCountryByName(@Query('name') name: any): Promise<CountryDTO[]> {

        const countryList: CountryDTO[] = await this.addressService.getCountries(name);

        return countryList;
    }
}
