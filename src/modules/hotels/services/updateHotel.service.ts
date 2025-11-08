import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { HOTEL_REPOSITORIES_TOKEN } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositories';


@Injectable()
export class UpdateHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORIES_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ){}
  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    return await this.hotelRepositories.update(id, updateHotelDto);
  }


}
