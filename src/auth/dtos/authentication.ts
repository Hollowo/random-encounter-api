import { Role } from "@prisma/client";

interface AuthDataDTO {
    id: string;
    authorized: boolean;
    access_token: string;
}

export {
    AuthDataDTO
}