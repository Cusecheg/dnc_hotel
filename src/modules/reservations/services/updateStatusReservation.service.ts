import { Inject, Injectable } from "@nestjs/common";
import { RESERVATION_TOKEN_REPOSITORY } from "../utils/reservation.token.reposository";
import type { IReservationRepository } from "../domain/repositories/ireservation.repository";
import { ReservationStatus } from "@prisma/client";
import { UpdateStatusReservationDto } from "../domain/dto/update-status-reservation.dto";

@Injectable()
export class UpdateStatusReservationService {
  constructor(
    @Inject(RESERVATION_TOKEN_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ){}
    async execute(id: number, status: ReservationStatus ) {
        return await this.reservationRepository.updateStatus(id, status);
    }

}


