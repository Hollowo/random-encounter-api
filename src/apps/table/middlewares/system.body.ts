import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateSystemBody {

    @IsNotEmpty()
    @ApiProperty()
    name: string;
}