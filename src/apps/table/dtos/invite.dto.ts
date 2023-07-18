import { UserDTO } from "src/apps/auth/dtos/user.dto";
import { TableDTO } from "./table.dto";

interface TableInviteDTO {
    table: TableDTO;
    user: UserDTO;
    isJoinRequest: boolean;
    checked: boolean;
    createdAt: Date;
}

export {
    TableInviteDTO
}