import { CityDTO } from "./city";
import { CountryDTO } from "./country";
import { ProvinceDTO } from "./province";

interface AddressDTO {
    id: string;
    createdAt: Date;
    description: string;
    city: CityDTO;
    province: ProvinceDTO;
    country: CountryDTO;
}

export {
    AddressDTO
}