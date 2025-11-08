import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORIES_TOKEN } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositories';

@Injectable()
export class FindByOwnerHotelService {
   constructor(
      @Inject(HOTEL_REPOSITORIES_TOKEN)
      private readonly hotelRepositories: IHotelRepository,
   ){}
  async execute(id: number) {
    return this.hotelRepositories.findHotelByOwner(id);
  }


}
