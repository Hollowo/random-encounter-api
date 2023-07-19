import { Injectable, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { InvalidCredentialsException, InvalidRefreshToken, UserNotFoundException } from "src/middlewares/HttpException";
import { AuthDataDTO } from "../dtos/authentication.dto";
import { AuthService } from "../auth.service";
import { compareSync } from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private authService: AuthService,
    ) {
        super({
            usernameField: 'email'
        })
    }

    async validate(email: string, password: string): Promise<AuthDataDTO> {
        const userAuthData: AuthDataDTO = await this.authService.makeLogin(email);

        if (userAuthData) {
            const isPasswordValid: boolean = compareSync(password, userAuthData.password);
            if (!isPasswordValid) throw new InvalidCredentialsException;
        } else {
            throw new UserNotFoundException;
        }

        return userAuthData;
    }
}