import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { SystemDTO } from "../dtos/system.dto";

export class CreateTableInviteBody {
    
    @IsNotEmpty()
    @ApiProperty()
    tableId: string;

    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}

export class UpdateTableInviteBody extends CreateTableInviteBody {

    @IsNotEmpty()
    @ApiProperty()
    approved: boolean;
}
