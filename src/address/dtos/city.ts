import { ProvinceDTO } from "./province";

interface CityDTO {
    id: string;
    name: string;
    province: ProvinceDTO;
}

export {
    CityDTO
}