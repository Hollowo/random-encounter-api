import { Injectable, Req } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { InvalidCredentialsException, InvalidRefreshToken, UserNotFoundException } from "src/middlewares/HttpException";
import { AuthDataDTO } from "../dtos/authentication.dto";
import { AuthService } from "../service/auth.service";
import { compareSync } from 'bcrypt';
import jwtDecode from "jwt-decode";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
    ) {
        super({
            usernameField: 'email',
            passReqToCallback: true
        })
    }

    async validate(@Req() req: any, email: string, password: string): Promise<AuthDataDTO> {

        console.log(req.url)
        if (req.url !== '/auth/login' && req.url !== '/auth/login/') {
            console.log('entrou?')
            const refreshToken = req.headers.refresh_token;

            if (!refreshToken) throw new InvalidRefreshToken;

            const decodedRefreshToken: any = jwtDecode(refreshToken);

            const { refreshTokenEmail } = decodedRefreshToken;

            const refreshTokenResponse = (await this.authService.checkRefreshToken(refreshTokenEmail, refreshToken)).refreshToken

            const isRefreshTokenValid: boolean = refreshTokenResponse == undefined || refreshToken === refreshTokenResponse;
            if (!isRefreshTokenValid || refreshTokenEmail !== email) throw new InvalidRefreshToken;
        }

        const userAuthData: AuthDataDTO = await this.authService.makeLogin(email);

        if (userAuthData) {
            const isPasswordValid: boolean = await compareSync(password, userAuthData.password);
            if (!isPasswordValid) throw new InvalidCredentialsException;
        } else {
            throw new UserNotFoundException;
        }

        return userAuthData;
    }
}