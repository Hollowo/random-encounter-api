import { ApiProperty } from "@nestjs/swagger";
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

class TableParticipantDTO {
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
    
	@ApiProperty()
    participants: UserDTO[];
}

export {
    TableDTO,
    TableParticipantDTO,
    CompleteTableDTO
}