import { IsNotEmpty } from "class-validator";

export class CreateAddressBody {

    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    cityId: string;

    @IsNotEmpty()
    provinceId: string;

    @IsNotEmpty()
    countryId: string;

}