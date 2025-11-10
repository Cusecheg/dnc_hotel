import { Inject, Injectable } from "@nestjs/common";
import { RESERVATION_TOKEN_REPOSITORY } from "../utils/reservation.token.reposository";
import type { IReservationRepository } from "../domain/repositories/ireservation.repository";

@Injectable()
export class FindAllReservationService {
  constructor(
    @Inject(RESERVATION_TOKEN_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ){}
    execute() {
        return this.reservationRepository.findAll();
    }

}