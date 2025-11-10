import { Hotel } from "@prisma/client";
import { CreateHotelDto } from "../domain/dto/create-hotel.dto";
import { IHotelRepository } from "../domain/repositories/Ihotel.repository";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HotelsRepositories implements IHotelRepository {
    constructor(
        private readonly prisma: PrismaService
    ){}
    create(data: CreateHotelDto): Promise<Hotel> {
        return this.prisma.hotel.create({ data })

    }
    findHotelById(id: number): Promise<Hotel | null> {
        return this.prisma.hotel.findUnique({ where: { id } })
    }
    findHotelByName(name: string): Promise<Hotel[] | null> {
        return this.prisma.hotel.findMany({ where: { name: { contains: name }} })
    }
    findHotels(page: number, limit: number): Promise<Hotel[]> {
        return  this.prisma.hotel.findMany({
            skip: page,
            take: limit,
            include: { owner: true },
        })
    }

    hotelsCount(): Promise<number> {
        return this.prisma.hotel.count();
    }

    findHotelByOwner(ownerId: number): Promise<Hotel[]> {
        return this.prisma.hotel.findMany({ where: { ownerId } })
    }
    update(id: number, data: Partial<CreateHotelDto>): Promise<Hotel> {
        return this.prisma.hotel.update({ where: { id }, data })
    }
    delete(id: number): Promise<Hotel> {
        return this.prisma.hotel.delete({ where: { id } })
    }
    
}