import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { CreateAddressBody } from 'src/address/middleware/address';

export class CreateUserBody {
	@IsNotEmpty()
	@Length(3, 100)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	role: Role;

	@IsNotEmpty()
	addressId: string;
}

export class CreateCompleteUserBody {

	@IsNotEmpty()
	user: CreateUserBody

	@IsNotEmpty()
	address: CreateAddressBody

}
