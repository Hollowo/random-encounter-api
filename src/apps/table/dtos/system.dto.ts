import { ApiProperty } from "@nestjs/swagger";

class SystemDTO {

    @ApiProperty()
    id: string;
    
    @ApiProperty()
    name: string;

}

export {
    SystemDTO
}