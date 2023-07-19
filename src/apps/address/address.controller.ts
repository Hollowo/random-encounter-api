import { Body, Controller, Get, Post, Patch, Param, Query } from '@nestjs/common';
import { AddressDTO, CityDTO, CountryDTO, ProvinceDTO } from 'src/apps/address/dtos/address.dto';
import { CreateAddressBody } from './middleware/address.body';
import { AddressService } from './address.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Address')
@Controller('address')
export class AddressController {
    constructor(
        private addressService: AddressService
    ) { }

	@ApiResponse({ status: 201, type: AddressDTO })
    @Post()
    async createAddress(@Body() body: CreateAddressBody): Promise<AddressDTO> {
        return await this.addressService.createAddress(body)
    }

	@ApiResponse({ status: 201, type: AddressDTO })
    @Patch('/:addressId')
    async updateAddress(@Body() body: CreateAddressBody, @Param('addressId') addressId: any): Promise<AddressDTO> {
        return await this.addressService.updateAddress(addressId, body);
    }

	@ApiResponse({ status: 200, type: CityDTO, isArray: true })
    @Get(':addressId')
    async getAddress(@Param('addressId') addressId: string): Promise<AddressDTO> {
        return await this.addressService.getAddress(addressId);
    }

	// @ApiResponse({ status: 200, type: CityDTO, isArray: true })
    @Get('city')
    async getCities(@Query('name') name: string, @Query('province') province: string): Promise<CityDTO[]> {
        console.log('ss')
        return await this.addressService.getCities(name, province);
    }

	@ApiResponse({ status: 200, type: ProvinceDTO, isArray: true })
    @Get('province')
    async getProvincies(@Query('name') name: string, @Query('country') country: string): Promise<ProvinceDTO[]> {
        return await this.addressService.getProvincies(name, country);
    }

	@ApiResponse({ status: 200, type: CountryDTO, isArray: true })
    @Get('country')
    async getCountryByName(@Query('name') name: any): Promise<CountryDTO[]> {
        return await this.addressService.getCountries(name);
    }
}
