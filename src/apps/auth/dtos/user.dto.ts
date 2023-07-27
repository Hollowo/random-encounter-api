import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AddressDTO } from 'src/apps/address/dtos/address.dto';

class UserDTO {

	@ApiProperty()
	id: string;

	@ApiProperty()
	createdAt?: Date;

	@ApiProperty()
	name: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password?: string;

	@ApiProperty()
	role: Role;

	@ApiProperty()
	authorized?: boolean;

	@ApiProperty()
    colorHex?: string;

	@ApiProperty()
	addressId?: string;
}

class CompleteUserDTO {
	
	@ApiProperty()
	user: UserDTO;

	@ApiProperty()
	address: AddressDTO;
}

export {
	UserDTO,
	CompleteUserDTO
};
