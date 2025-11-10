import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { HOTEL_TOKEN_REPOSITORY } from '../utils/hotel.token.repository';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';


@Injectable()
export class UpdateHotelService {
  constructor(
    @Inject(HOTEL_TOKEN_REPOSITORY)
    private readonly hotelRepositories: IHotelRepository,
  ){}
  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    return await this.hotelRepositories.update(id, updateHotelDto);
  }


}
