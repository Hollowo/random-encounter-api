import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { AddressDTO, CityDTO, CountryDTO, ProvinceDTO } from 'src/address/dtos/address';
import { AddressService } from 'src/address/service/address.service';
import { CreateAddressBody } from './middleware/address';

@Controller('address')
export class AddressController {
    constructor(
        private addressService: AddressService
    ) { }

    @Post()
    async createAddress(@Body() body: CreateAddressBody): Promise<AddressDTO> {

        const createdAddress: AddressDTO = await this.addressService.createAddress(body)

        return createdAddress;
    }

    @Patch('/:id')
    async updateAddress(@Body() body: CreateAddressBody, @Param() params: any): Promise<AddressDTO> {

        const id = params.id;

        const updatedAddress: AddressDTO = await this.addressService.updateAddress(id, body);

        return updatedAddress;
    }
    

    @Get(['city/:name', 'city/province/:provName', 'city/:name/:provName'])
    async getCities(@Param() params: any): Promise<CityDTO[]> {

        const { name, provName } = params;

        const cityList: CityDTO[] = await this.addressService.getCities(name, provName);

        return cityList;
    }

    @Get(['province/:name', 'province/country/:countryName', 'province/:name/:countryName',  'province'])
    async getProvincies(@Param() params: any): Promise<ProvinceDTO[]> {

        const { name, countryName } = params;

        const provinceList: ProvinceDTO[] = await this.addressService.getProvincies(name, countryName);

        return provinceList;
    }

    @Get(['country/:name', 'country'])
    async getCountryByName(@Param() params: any): Promise<CountryDTO[]> {

        const name = params.name;

        const countryList: CountryDTO[] = await this.addressService.getCountries(name);

        return countryList;
    }
}
