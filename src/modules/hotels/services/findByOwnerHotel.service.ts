import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_TOKEN_REPOSITORY } from '../utils/hotel.token.repository';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';

@Injectable()
export class FindByOwnerHotelService {
   constructor(
      @Inject(HOTEL_TOKEN_REPOSITORY)
      private readonly hotelRepositories: IHotelRepository,
   ){}
  async execute(id: number) {
    return this.hotelRepositories.findHotelByOwner(id);
  }


}
