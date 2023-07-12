import { Body, Controller, Get, Post, Patch, Param } from '@nestjs/common';
import { AddressDTO } from 'src/address/dtos/address';
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
}
