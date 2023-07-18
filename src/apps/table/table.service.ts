import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { randomUUID } from 'node:crypto';
import { AddressDTO } from 'src/apps/address/dtos/address.dto';
import { CreateAddressBody } from 'src/apps/address/middleware/address.body';
import { AddressService } from '../address/address.service';
import { CreateTableBody, CreateTableParticipantBody } from './middlewares/table.body';
import { CompleteTableDTO, TableDTO, TableParticipantDTO } from './dtos/table.dto';
import { CompleteUserDTO } from '../auth/dtos/user.dto';
import { AuthService } from '../auth/auth.service';
import { TableParticipant } from '@prisma/client';
import { SystemDTO } from './dtos/system.dto';
import { TableInviteDTO } from './dtos/invite.dto';

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

            const tableParticipants: CreateTableParticipantBody = {
                tableId: createdTable.id,
                userId: createdTable.ownerId,
            }

            // Adding owner as a table participant
            await this.createTableParticipants([tableParticipants]);
		});

        const owner: CompleteUserDTO = await this.authService.getUserById(table.ownerId);
        const ownerAsParticipant: CompleteUserDTO = await this.authService.getUserById(table.ownerId);

		const createdCompleteTable: CompleteTableDTO = {
			table: createdTable,
			owner: owner,
            participants: [ownerAsParticipant]
		};

		return createdCompleteTable;
	}

    async createTable(table: CreateTableBody): Promise<TableDTO> {
        const createdTable: TableDTO = await this.prisma.table.create({
            data: {
                id: randomUUID(),
                title: table.title,
                description: table.description,
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

    async createTableParticipants(tableParticipant: CreateTableParticipantBody[]): Promise<TableParticipantDTO[]> {
        var createdTableParticipants: TableParticipantDTO[] = [];

        await this.prisma.$transaction(async () => {
            await Promise.all(
                tableParticipant.map( async participant => {

                    const isInviteChecked: boolean = (await this.getTableInvite(participant.userId, participant.tableId)).checked

                    const existentParticipant: boolean = await this.getta 

                    const userAlreadyInTheTable: boolean = isInviteChecked;


                    const createdParticipant: TableParticipantDTO = await this.prisma.tableParticipant.create({
                        data: {
                            tableId: participant.tableId,
                            userId: participant.userId,
                        },
                        select: {
                            tableId: true,
                            userId: true,
                            createdAt: true
                        }
                    })

                    createdTableParticipants.push(createdParticipant)
                    await this.updateTableInvite(createdParticipant.userId, createdParticipant.tableId)
                })
            )
        })
        
        return createdTableParticipants;
    }

    async getTable(tableId: string): Promise<CompleteTableDTO> {
        
        const completeTable: CompleteTableDTO = undefined;
        
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

        const owner: CompleteUserDTO = await this.authService.getUserById(table.ownerId);

        // wip

        return completeTable;
    }

    async createParticipantInvite(userId: string, tableId: string, isJoinRequest: boolean) {
        await this.prisma.tableInvite.create({
            data: {
                tableId: tableId,
                userId: userId,
                checked: false,
                isJoinRequest: isJoinRequest
            }
        })
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

}
