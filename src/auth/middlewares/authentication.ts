import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateLoginBody {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}