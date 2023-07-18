import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

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

}

export class CreateTableParticipantBody {

    @IsNotEmpty()
    @ApiProperty()
    tableId: string;

    @IsNotEmpty()
    @ApiProperty()
    userId: string;

}