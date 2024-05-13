import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreateTableBody, UpdateTableBody } from './middlewares/table.body';
import { CompleteTableDTO, TableDTO, TablePlayerDTO } from './dtos/table.dto';
import { TableService } from './table.service';
import { AuthGuard } from '@nestjs/passport';
import { SystemDTO } from './dtos/system.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TableInviteDTO } from './dtos/invite.dto';
import { CreateTableInviteBody, UpdateTableInviteBody } from './middlewares/invite.body';
import { CreateTablePlayerBody } from './middlewares/table.body';
import { UserDTO } from '../auth/dtos/user.dto';
import { DeleteSuccess } from 'src/middlewares/http.responses';
import { SystemInUseException, UserOrTableNotFoundException } from 'src/middlewares/http.exception';
import { SystemNotFoundException } from 'src/middlewares/http.exception';
import { System } from '@prisma/client';
import { UpdateUserBody } from '../auth/middlewares/user.body';
import { UpdateSystemBody } from './middlewares/system.body';
import { get } from 'node:http';

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
        return await this.tableService.createCompleteTable(body);
	}

	@ApiResponse({ status: 201, type: CompleteTableDTO })
    @Patch(':tableId')
    async updateTable(@Param('tableId') tableId: string, @Body() body: UpdateTableBody): Promise<TableDTO> {
        return await this.tableService.updateTable(tableId, body);
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
                if (!isJoinRequest) {
                    const updateBody: UpdateTableInviteBody = {
                        userId,
                        tableId,
                        approved: true
                    }

                    await this.updateTableInvite(undefined, updateBody);
                }
            } else {
                await this.tableService.createPlayerInvite(userId, tableId, isJoinRequest);
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
            const tablePlayer: CreateTablePlayerBody = {
                userId, 
                tableId
            };

            await this.tableService.createTablePlayers([tablePlayer]);
        } else {
            await this.tableService.updateTableInvite(userId, tableId);
        }

        if (res)
            return res.status(201).json({ message: approved ? 'Player added to the table!' : 'Player not added to the table!' });
    }

	@ApiResponse({ status: 200, type: SystemDTO, isArray: true })
    @Get('system')
    async getSystem(@Query('name') name: string): Promise<SystemDTO[]> {
        return await this.tableService.getSystem(name);
    }

	@ApiResponse({ status: 200, type: CompleteTableDTO })
    @Get(':tableId')
    async getTable(@Param('tableId') tableId: string): Promise<CompleteTableDTO> {
        return await this.tableService.getTable(tableId);
    }

	@ApiResponse({ status: 200, type: CompleteTableDTO, isArray: true })
    @Get('/owner/:ownerId')
    async getTableByOwner(@Param('ownerId') ownerId: string): Promise<CompleteTableDTO[]> {
        return await this.tableService.getTableByOwnerId(ownerId);
    }

	@ApiResponse({ status: 200, type: TableInviteDTO, isArray: true })
    @Get('invites/:userId')
    async getUserInvites(@Param('userId') userId: string): Promise<TableInviteDTO[]> {
        return await this.tableService.getTableInvitesByUser(userId);
    }

    
	@ApiResponse({ status: 200, type: TableInviteDTO, isArray: true })
    @Get(':tableId/joins')
    async getTableJoinRequest(@Param('tableId') tableId: string): Promise<TableInviteDTO[]> {
        return await this.tableService.getJoinRequestByTable(tableId);
    }

	@ApiResponse({ status: 200, type: UserDTO, isArray: true })
    @Get(':tableId/players')
    async getTablePlayers(@Param('tableId') tableId: string): Promise<UserDTO[]> {
        return await this.tableService.getTablePlayers(tableId)
    }

    @Delete(':tableId/players/:userId')
    async removePlayerFromTable(@Param('tableId') tableId: string, @Param('userId') userId: string) {
        try {
            const deletedPlayer = await this.tableService.deletePlayerFromTable(userId, tableId);
            if (deletedPlayer) {
                return DeleteSuccess;
            } else {
                throw new UserOrTableNotFoundException;
            }
        } catch (ex) {
            throw ex
        }
    }

    @Patch('system/:systemId')
    async updateSystem(@Param('systemId') systemId: string , @Body() body: UpdateSystemBody): Promise<SystemDTO>{
        return await this.tableService.updateSystem(systemId, body)
    }

    @Get('system/:systemId')
    async getTableBySystemId(@Param('systemId') systemId: string,): Promise<CompleteTableDTO[]> {
        return await this.tableService.getTableBySystemId(systemId);
    }

    @Delete('system/:systemId')
    async deleteSystem(@Param('systemId') systemId: string,) {
        try {
            const tablesBySystem: CompleteTableDTO[] = await this.tableService.getTableBySystemId(systemId);

            if (tablesBySystem.length == 0) {
                const deleteSystem = await this.tableService.deleteSystem(systemId);
                return DeleteSuccess;
            } else {
                throw new SystemInUseException;
            }
        } catch (ex) {
            throw ex 
        }
    }     
}