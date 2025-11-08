import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_REPOSITORIES_TOKEN } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositories';


@Injectable()
export class FindAllHotelService {
 constructor(
    @Inject(HOTEL_REPOSITORIES_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
 ){}
  async execute( page: number, limit: number ) {
    const offSet = (page - 1) * limit;

    const data = await this.hotelRepositories.findHotels(offSet, limit);
    const total = await this.hotelRepositories.hotelsCount();

    return {
      total,
      page,
      per_page: limit,
      data
    }
  }

}
