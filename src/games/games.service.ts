import UnprocessableEntityException from "src/utils/handle-error-unique.util";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { Prisma } from "@prisma/client";
import { Users } from "src/users/entities/users.entities";

@Injectable()
export class GameService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return await this.prisma.games.findMany({
			include: {
				genders: true,
			},
		});
	}

	async findById(id: string) {
		const record = await this.prisma.games.findUnique({
			where: { id },
			include: {
				genders: true,
			},
		});

		if (!record) {
			throw new NotFoundException(`${id} not found`);
		}
		return record;
	}

	async create(dto: CreateGameDto, user: Users) {
		if (user.isAdmin) {
			const data: Prisma.GamesCreateInput = {
				title: dto.title,
				description: dto.description,
				image: dto.image,
				year: dto.year,
				score: dto.score,
				trailer: dto.trailer,
				gameplay: dto.gameplay,
				genders: {
					connect: {
						id: dto.genderId,
					},
				},
			};

			return await this.prisma.games
				.create({
					data,
					include: {
						genders: true,
					},
				})
				.catch(UnprocessableEntityException);
		} else {
			throw new UnauthorizedException("not authorized");
		}
	}

	async update(id: string, dto: UpdateGameDto, user: Users) {
		if (user.isAdmin) {
			const data: Prisma.GamesUpdateInput = {
				title: dto.title,
				description: dto.description,
				image: dto.image,
				year: dto.year,
				score: dto.score,
				trailer: dto.trailer,
				gameplay: dto.gameplay,
				genders: {
					connect: {
						id: dto.genderId,
					},
				},
			};
			return await this.prisma.games
				.update({
					where: { id },
					data,
					include: {
						genders: true,
					},
				})
				.catch(UnprocessableEntityException);
		} else {
			throw new UnauthorizedException("not authorized");
		}
	}

	async delete(id: string, user: Users) {
		if (user.isAdmin) {
			await this.findById(id);
			await this.prisma.games.delete({ where: { id } });
		} else {
			throw new UnauthorizedException("not authorized");
		}
	}
}
