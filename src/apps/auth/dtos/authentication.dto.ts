import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

class AuthDataDTO {
	@ApiProperty()
    id: string;

	@ApiProperty()
    email: string;

	@ApiProperty()
    password: string;

	@ApiProperty()
    authorized: boolean;
}

class PayloadDTO {
	@ApiProperty()
    sub: string;
    
	@ApiProperty()
    email: string;

	@ApiProperty()
    authorized: boolean;
}

class TokenDTO {
	@ApiProperty()
    token: string;
    
	@ApiProperty()
    refreshToken: string;
}

export {
    AuthDataDTO,
    PayloadDTO,
    TokenDTO
}