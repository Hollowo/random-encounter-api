import { AddressDTO } from 'src/address/dtos/address';

interface UserDTO {
	id: string;
	createdAt: Date;
	name: string;
	email: string;
	password: string;
	role: string;
	authorized: boolean;
	addressId: string;
}

interface CompleteUserDTO {
	user: UserDTO;
	address: AddressDTO;
}

export {
	UserDTO,
	CompleteUserDTO
};
