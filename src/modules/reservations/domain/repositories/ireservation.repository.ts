import { Reservation, ReservationStatus } from "@prisma/client";
import { CreateReservationDto } from "../dto/create-reservation.dto";

export interface IReservationRepository {
    create(data: any): Promise<Reservation>;
    findById(id: number): Promise<Reservation | null>;
    findAll(): Promise<Reservation[]>;
    findByUser(userId: number): Promise<Reservation[]>;
    updateStatus(id: number, status: ReservationStatus): Promise<Reservation>;
}