import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTableBody {

    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsNotEmpty()
    @ApiProperty()
    ownerId: string;

    @IsNotEmpty()
    @ApiProperty()
    systemId: string;

    @IsOptional()
    @ApiProperty({ required: false })
    imageUrl: string;

}

export class UpdateTableBody extends CreateTableBody {}

export class CreateTablePlayerBody {

    @IsNotEmpty()
    @ApiProperty()
    tableId: string;

    @IsNotEmpty()
    @ApiProperty()
    userId: string;

}