import { Hotel } from "@prisma/client";
import { CreateHotelDto } from "../dto/create-hotel.dto";



export interface IHotelRepository {
    create(data: CreateHotelDto): Promise<Hotel>;
    findHotelById(id: number): Promise<Hotel | null>;
    findHotelByName(name: string): Promise<Hotel[] | null>;
    findHotelByOwner(ownerId: number): Promise<Hotel[]>;
    findHotels(page: number, limit: number): Promise<Hotel[]>;
    hotelsCount(): Promise<number>;
    update(id: number, data: Partial<CreateHotelDto>): Promise<Hotel>;
    delete(id: number): Promise<Hotel>;
}