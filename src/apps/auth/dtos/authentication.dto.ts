import { Role } from "@prisma/client";

interface AuthDataDTO {
    id: string;
    email: string;
    password: string;
    authorized: boolean;
}

interface PayloadDTO {
    sub: string;
    email: string;
    authorized: boolean;
}

interface TokenDTO {
    token: string;
    refreshToken: string;
}

export {
    AuthDataDTO,
    PayloadDTO,
    TokenDTO
}