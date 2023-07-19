import { ApiProperty } from "@nestjs/swagger";

class CountryDTO {

	@ApiProperty()
    id: string;

	@ApiProperty()
    name: string;

	@ApiProperty()
    flag: string;
}

class ProvinceDTO {

	@ApiProperty()
    id: string;

	@ApiProperty()
    name: string;

	@ApiProperty()
    country: CountryDTO;
}

class CityDTO {

	@ApiProperty()
    id: string;

	@ApiProperty()
    name: string;

	@ApiProperty()
    province: ProvinceDTO;
}

class AddressDTO {
    
	@ApiProperty()
    id: string;

	@ApiProperty()
    createdAt: Date;

	@ApiProperty()
    description: string;

	@ApiProperty()
    city: CityDTO;

	@ApiProperty()
    province: ProvinceDTO;

	@ApiProperty()
    country: CountryDTO;
}

export {
    AddressDTO,
    CountryDTO,
    ProvinceDTO,
    CityDTO
}