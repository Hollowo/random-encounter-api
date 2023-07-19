import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
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
	role: string;

	@ApiProperty()
	authorized?: boolean;

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
