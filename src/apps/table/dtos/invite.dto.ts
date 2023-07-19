import { UserDTO } from "src/apps/auth/dtos/user.dto";
import { TableDTO } from "./table.dto";
import { ApiProperty } from "@nestjs/swagger";

class TableInviteDTO {
	@ApiProperty()
    table: TableDTO;
    
	@ApiProperty()
    user: UserDTO;

	@ApiProperty()
    isJoinRequest: boolean;

	@ApiProperty()
    checked: boolean;

	@ApiProperty()
    createdAt: Date;
}

export {
    TableInviteDTO
}