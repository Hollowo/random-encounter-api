import { CountryDTO } from "./country";

interface ProvinceDTO {
    id: string;
    name: string;
    country: CountryDTO;
}

export {
    ProvinceDTO
}