import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { HOTEL_REPOSITORIES_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class CreateHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORIES_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ){}
  async execute(createHotelDto: CreateHotelDto) {
    return await this.hotelRepositories.create(createHotelDto);
  }

}
