import { Body, Controller, Get, HttpException, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreateTableBody } from './middlewares/table.body';
import { CompleteTableDTO, TableParticipantDTO } from './dtos/table.dto';
import { TableService } from './table.service';
import { AuthGuard } from '@nestjs/passport';
import { SystemDTO } from './dtos/system.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TableInviteDTO } from './dtos/invite.dto';
import { CreateTableInviteBody, UpdateTableInviteBody } from './middlewares/invite.body';
import { CreateTableParticipantBody } from './middlewares/table.body';

@Controller('table')
@ApiTags('Tables')
@UseGuards(AuthGuard('refresh'))
export class TableController {
	constructor(
        private tableService: TableService
	) {}

	@ApiResponse({ status: 201, type: CompleteTableDTO })
	@Post()
	async createTable(@Body() body: CreateTableBody): Promise<CompleteTableDTO> {

        const createdTable: CompleteTableDTO = await this.tableService.createCompleteTable(body);

        return createdTable;
	}

	@ApiResponse({ status: 201, type: TableInviteDTO })
    @Post(['invite', 'join'])
    async inviteUser(@Req() req: any, @Res() res: any, @Body() body: CreateTableInviteBody ): Promise<TableInviteDTO> {
        try {

            const { userId, tableId } = body;
            const isJoinRequest: boolean = req.url.includes('/join');

            const userInviteAlreadyExists: boolean = (await this.getUserInvites(userId))?.filter(invite => {
                invite.table.id === tableId
            }).length > 0

            if (userInviteAlreadyExists) {

            } else {
                await this.tableService.createParticipantInvite(userId, tableId, isJoinRequest);
                return res.status(201).json({ message: `${isJoinRequest ? 'Join request' : 'Invite' } sent with success` });
            }
            
        } catch (ex) {
            throw ex;
        }
    }

    @Patch('manage-invite')
    async updateTableInvite(@Res() res: any, @Body() body: UpdateTableInviteBody) {
        
        const { approved, userId, tableId } = body;

        if (approved) {
            const tableParticipant: CreateTableParticipantBody = {
                userId, 
                tableId
            };

            await this.tableService.createTableParticipants([tableParticipant]);
        } else {
            await this.tableService.updateTableInvite(userId, tableId);
        }

        return res.status(201).json({ message: approved ? 'Player added to the table!' : 'Player not added to the table!' });
    }

	@ApiResponse({ status: 200, type: TableInviteDTO, isArray: true })
    @Get('invites/:userId')
    async getUserInvites(@Param('userId') userId: string): Promise<TableInviteDTO[]> {

        const userTableInvites: TableInviteDTO[] = await this.tableService.getTableInvitesByUser(userId);

        return userTableInvites;
    }

	@ApiResponse({ status: 200, type: TableInviteDTO, isArray: true })
    @Get('joins/:tableId')
    async getTableJoinRequest(@Param('tableId') tableId: string): Promise<TableInviteDTO[]> {

        const joinRequestList: TableInviteDTO[] = await this.tableService.getJoinRequestByTable(tableId);

        return joinRequestList;
    }

	@ApiResponse({ status: 200, type: SystemDTO, isArray: true })
    @Get('system')
    async getSystem(@Query('name') name: string): Promise<SystemDTO[]> {

        const systemList: SystemDTO[] = await this.tableService.getSystem(name);

        return systemList;
    }

}
