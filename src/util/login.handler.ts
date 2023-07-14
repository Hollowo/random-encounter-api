import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthDataDTO, PayloadDTO, TokenDTO } from "src/auth/dtos/authentication.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class LoginHandler {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async generateJwtToken(authData: AuthDataDTO): Promise<TokenDTO> {
        const payload: PayloadDTO = {
            "sub": authData.id,
            "email": authData.email,
            "authorized": authData.authorized
        }

        const refreshToken: string = await this.generateRefreshToken(authData);

        return {
            token: this.jwtService.sign(payload),
            refreshToken: refreshToken
        };
    }

    async generateRefreshToken(authData: AuthDataDTO): Promise<string> {

        const refreshPayload = {
            "sub": authData.id,
            "email": authData.email
        }

        return this.jwtService.sign(refreshPayload);
    }
}