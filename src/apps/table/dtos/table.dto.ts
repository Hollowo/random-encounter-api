import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { CompleteUserDTO, UserDTO } from "src/apps/auth/dtos/user.dto";

class TableDTO {
	@ApiProperty()
    id: string;

	@ApiProperty()
    createdAt: Date;

	@ApiProperty()
    title: string;

	@ApiProperty()
    description: string;

	@ApiProperty()
    ownerId: string;

	@ApiProperty()
    systemId: string;
}

class TablePlayerDTO {
	@ApiProperty()
    tableId: string;

	@ApiProperty()
    userId: string;

	@ApiProperty()
    createdAt: Date;
}

class CompleteTableDTO {
	@ApiProperty()
    table: TableDTO;

	@ApiProperty()
    owner: CompleteUserDTO;

	@ApiProperty({ type: [UserDTO] })
    players: UserDTO[];
}

export {
    TableDTO,
    TablePlayerDTO,
    CompleteTableDTO
}