import { CompleteUserDTO, UserDTO } from "src/apps/auth/dtos/user.dto";

interface TableDTO {
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    ownerId: string;
    systemId: string;
}

interface TableParticipantDTO {
    tableId: string;
    userId: string;
    createdAt: Date;
}

interface CompleteTableDTO {
    table: TableDTO;
    owner: CompleteUserDTO;
    participants: CompleteUserDTO[];
}

export {
    TableDTO,
    TableParticipantDTO,
    CompleteTableDTO
}