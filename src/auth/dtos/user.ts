import { Role } from "@prisma/client";
import { AddressDTO } from "src/address/dtos/address";

interface UserDTO {
    id: string;
    createdAt: Date;
    name: string;
    email: string;
    role: string;
    addressId: string;
}

interface CompleteUserDTO {
    user: UserDTO;
    address: AddressDTO;
}

export {
    UserDTO,
    CompleteUserDTO,
}