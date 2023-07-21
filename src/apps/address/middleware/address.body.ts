import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAddressBody {
    
    @IsNotEmpty()
	@ApiPropertyOptional()
    description: string;

    @IsOptional()
	@ApiProperty()
    cityId: string;

    @IsOptional()
	@ApiProperty()
    provinceId: string;

    @IsNotEmpty()
	@ApiProperty()
    countryId: string;

}