import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserBody } from '../dtos/user';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async createUser(user: CreateUserBody): Promise<User> {
		const createdUser = await this.prisma.user.create({
			data: {
				name: user.name,
			},
			select: {
				id: true,
				name: true,
			},
		});

		return createdUser;
	}
}
