import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAddressBody {
    
    @IsNotEmpty()
	@ApiPropertyOptional()
    description: string;

    @IsNotEmpty()
	@ApiProperty()
    cityId: string;

    @IsNotEmpty()
	@ApiProperty()
    provinceId: string;

    @IsNotEmpty()
	@ApiProperty()
    countryId: string;

}