import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'node:crypto';
import { AddressDTO } from 'src/apps/address/dtos/address.dto';
import { CreateAddressBody } from 'src/apps/address/middleware/address.body';
import { AddressService } from '../address/address.service';
import { CreateTableBody, CreateTablePlayerBody, UpdateTableBody } from './middlewares/table.body';
import { CompleteTableDTO, TableDTO, TablePlayerDTO } from './dtos/table.dto';
import { CompleteUserDTO, UserDTO } from '../auth/dtos/user.dto';
import { AuthService } from '../auth/auth.service';
import { TablePlayer, User } from '@prisma/client';
import { SystemDTO } from './dtos/system.dto';
import { TableInviteDTO } from './dtos/invite.dto';
import { UserAlreadyInTheTableException } from 'src/middlewares/http.exception';
import { isNullOrUndefined } from 'node:util';

@Injectable()
export class TableService {
	constructor(
		private prisma: PrismaService,
		private authService: AuthService
	) { }

	async createCompleteTable(table: CreateTableBody): Promise<CompleteTableDTO> {
		var createdTable: TableDTO = undefined;

		await this.prisma.$transaction(async () => {
			createdTable = await this.createTable(table);

            const tablePlayers: CreateTablePlayerBody = {
                tableId: createdTable.id,
                userId: createdTable.ownerId,
            }

            // Adding owner as a table player
            await this.createTablePlayers([tablePlayers]);
		});

        const owner: CompleteUserDTO = await this.authService.getCompleteUserById(table.ownerId);
        const ownerAsPlayer: UserDTO = await this.authService.getUserById(table.ownerId);

		const createdCompleteTable: CompleteTableDTO = {
			table: createdTable,
			owner: owner,
            players: [ownerAsPlayer]
		};

		return createdCompleteTable;
	}

    async createTable(table: CreateTableBody): Promise<TableDTO> {
        const createdTable: TableDTO = await this.prisma.table.create({
            data: {
                id: randomUUID(),
                title: table.title,
                description: table.description,
                imageUrl: table.imageUrl ? table.imageUrl : ' ',
                ownerId: table.ownerId,
                systemId: table.systemId
            },
            select: {
                id: true,
                createdAt: true,
                title: true,
                description: true,
                ownerId: true,
                systemId: true
            }
        })

        return createdTable;
    }

    async updateTable(tableId: string, table: UpdateTableBody): Promise<TableDTO> {
        const updatedTable: TableDTO = await this.prisma.table.update({
            data: {
                title: table.title,
                description: table.description,
                ownerId: table.ownerId,
                systemId: table.systemId
            },
            where: {
                id: tableId
            }
        })

        return updatedTable;
    }

    async createTablePlayers(tablePlayer: CreateTablePlayerBody[]): Promise<TablePlayerDTO[]> {
        var createdTablePlayers: TablePlayerDTO[] = [];

        await this.prisma.$transaction(async () => {
            await Promise.all(
                tablePlayer.map( async player => {

                    const tableId = player.tableId;
                    const userId = player.userId;
                    
                    const userExistOnTable: boolean = await this.userExistsOnTable(userId, tableId);
                    if (userExistOnTable)
                        throw new UserAlreadyInTheTableException;

                    const createdPlayer: TablePlayerDTO = await this.prisma.tablePlayer.create({
                        data: {
                            tableId: tableId,
                            userId: userId,
                        },
                        select: {
                            tableId: true,
                            userId: true,
                            createdAt: true
                        }
                    })

                    createdTablePlayers.push(createdPlayer)

                    const inviteExists: boolean = await this.getTableInvite(userId, tableId) != undefined;

                    if (inviteExists)
                        await this.updateTableInvite(userId, tableId)
                })
            )
        })
        
        return createdTablePlayers;
    }

    async createPlayerInvite(userId: string, tableId: string, isJoinRequest: boolean) {
        await this.prisma.tableInvite.create({
            data: {
                tableId: tableId,
                userId: userId,
                checked: false,
                isJoinRequest: isJoinRequest
            }
        })
    }

    async getTable(tableId: string): Promise<CompleteTableDTO> {
        
        const table: TableDTO = await this.prisma.table.findUnique({
            select: {
                id: true,
                createdAt: true,
                title: true,
                description: true,
                ownerId: true,
                systemId: true,
            }, 
            where: {
                id: tableId
            }
        })

        const owner: CompleteUserDTO = await this.authService.getCompleteUserById(table.ownerId);
        const players: UserDTO[] = await this.getTablePlayers(tableId);

        const completeTable: CompleteTableDTO = {
            table,
            owner,
            players
        } 
        
        return completeTable;
    }

    async getTablePlayers(tableId: string): Promise<UserDTO[]> {
        const playerList: UserDTO[] = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                addressId: true
            },
            where: {
                TablePlayer: {
                    some: {
                        tableId: tableId
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return playerList;
    }

    async getSystem(name: string): Promise<SystemDTO[]> {
        const systemList: SystemDTO[] = await this.prisma.system.findMany({
            select: {
                id: true,
                name: true
            },
            where: name ? {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            } : {}
        }) 

        return systemList;
    }

    async getTableInvite(userId: string, tableId: string): Promise<TableInviteDTO> {
        const userInviteList: TableInviteDTO = await this.prisma.tableInvite.findUnique({
            select: {
                table: {
                    select: {
                        id: true,
                        createdAt: true,
                        title: true,
                        description: true,
                        ownerId: true,
                        systemId: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        createdAt: true,
                        name: true,
                        email: true,
                        role: true,
                        authorized: true,
                        addressId: true,
                    }
                },
                checked: true,
                isJoinRequest: true,
                createdAt: true,
            },
            where: {
                tableId_userId: {
                    tableId: tableId,
                    userId: userId
                },
            }
        })

        return userInviteList;
    }
    async getTableInvitesByUser(userId: string): Promise<TableInviteDTO[]> {
        const userInviteList: TableInviteDTO[] = await this.prisma.tableInvite.findMany({
            select: {
                table: {
                    select: {
                        id: true,
                        createdAt: true,
                        title: true,
                        description: true,
                        ownerId: true,
                        systemId: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        createdAt: true,
                        name: true,
                        email: true,
                        role: true,
                        authorized: true,
                        addressId: true,
                    }
                },
                checked: true,
                isJoinRequest: true,
                createdAt: true,
            },
            where: {
                userId: userId,
                isJoinRequest: false,
                checked: false
            }
        })

        return userInviteList;
    }

    async getJoinRequestByTable(tableId: string): Promise<TableInviteDTO[]> {
        const joinRequestList: TableInviteDTO[] = await this.prisma.tableInvite.findMany({
            select: {
                table: {
                    select: {
                        id: true,
                        createdAt: true,
                        title: true,
                        description: true,
                        ownerId: true,
                        systemId: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        createdAt: true,
                        name: true,
                        email: true,
                        role: true,
                        authorized: true,
                        addressId: true,
                    }
                },
                checked: true,
                isJoinRequest: true,
                createdAt: true,
            },
            where: {
                tableId: tableId,
                isJoinRequest: true,
                checked: false
            }
        })

        return joinRequestList;
    }

    async updateTableInvite(userId: string, tableId: string) {
        await this.prisma.tableInvite.update({
            data: {
                checked: true,
            },
            where: {
                tableId_userId: {
                    tableId: tableId,
                    userId: userId
                }
            }
        })
    }

    async deletePlayerFromTable(userId: string, tableId: string) {
        return await this.prisma.tablePlayer.delete({
            where: {
                tableId_userId: {
                    tableId: tableId,
                     userId: userId
                }
            },
            select: {
                tableId: true,
                userId: true
            }
        })
    }

    async userExistsOnTable(userId: string, tableId: string): Promise<boolean> {
        const isInviteChecked: boolean = (await this.getTableInvite(userId, tableId))?.checked;
                    
        const playerList: UserDTO[] = await this.getTablePlayers(tableId);

        const existentPlayer: boolean = playerList.filter(contester => contester.id === userId).length > 0;

        return isInviteChecked && existentPlayer;
    }

}
