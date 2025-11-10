import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { HOTEL_TOKEN_REPOSITORY } from '../utils/hotel.token.repository';

@Injectable()
export class CreateHotelService {
  constructor(
    @Inject(HOTEL_TOKEN_REPOSITORY)
    private readonly hotelRepositories: IHotelRepository,
  ){}
  async execute(createHotelDto: CreateHotelDto) {
    return await this.hotelRepositories.create(createHotelDto);
  }

}
