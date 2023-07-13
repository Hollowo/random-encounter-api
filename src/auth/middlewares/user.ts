import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, isStrongPassword, Length, ValidateNested } from 'class-validator';
import { CreateAddressBody } from 'src/address/middleware/address';

export class UpdateUserBody {

	@IsOptional()
	@Length(3, 100)
	name: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	password: string;

	@IsOptional()
	@IsEnum(Role)
	role: Role;
}

export class CreateUserBody {

	@IsNotEmpty()
	@Length(3, 100)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	@IsEnum(Role)
	role: Role;

	addressId: string
}

export class CreateCompleteUserBody {

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateUserBody)
	user: CreateUserBody

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => CreateAddressBody)
	address: CreateAddressBody

}
