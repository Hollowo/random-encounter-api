interface AddressDTO {
    id: string;
    createdAt: Date;
    description: string;
    city: CityDTO;
    province: ProvinceDTO;
    country: CountryDTO;
}

interface CountryDTO {
    id: string;
    name: string;
    flag: string;
}

interface ProvinceDTO {
    id: string;
    name: string;
    country: CountryDTO;
}

interface CityDTO {
    id: string;
    name: string;
    province: ProvinceDTO;
}

export {
    AddressDTO,
    CountryDTO,
    ProvinceDTO,
    CityDTO
}