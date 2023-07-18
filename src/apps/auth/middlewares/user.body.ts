import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, Matches, ValidateNested } from 'class-validator';
import { CreateAddressBody } from 'src/apps/address/middleware/address.body';
import { RegExHelper } from 'src/util/regex.helper';

export class UpdateUserBody {

	@IsOptional()
	@Length(3, 100)
	name: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@Matches(RegExHelper.password)
	password: string;

	@IsOptional()
	@IsEnum(Role)
	role: Role;

	@IsOptional()
	refreshToken: string;
}

export class CreateUserBody {

	@IsNotEmpty()
	@Length(3, 100)
	@ApiProperty()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string;

	@IsNotEmpty()
	@Matches(RegExHelper.password, {
		message: 'password too weak'
	})
	@ApiProperty()
	password: string;

	@IsNotEmpty()
	@IsEnum(Role)
	@ApiProperty()
	role: Role;

	refreshToken: string;

	addressId: string;
}

export class CreateCompleteUserBody {

	@IsNotEmpty()
	@ValidateNested()
	@ApiProperty()
	@Type(() => CreateUserBody)
	user: CreateUserBody

	@IsNotEmpty()
	@ValidateNested()
	@ApiProperty()
	@Type(() => CreateAddressBody)
	address: CreateAddressBody

}
