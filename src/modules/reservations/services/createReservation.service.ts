import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { RESERVATION_TOKEN_REPOSITORY } from '../utils/reservation.token.reposository';
import type { IReservationRepository } from '../domain/repositories/ireservation.repository';
import { differenceInDays, parseISO } from 'date-fns';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/Ihotel.repository';
import { HOTEL_TOKEN_REPOSITORY } from 'src/modules/hotels/utils/hotel.token.repository';
@Injectable()
export class CreateReservationService {
  constructor(
    @Inject(RESERVATION_TOKEN_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
    @Inject(HOTEL_TOKEN_REPOSITORY)
    private readonly hotelRepository: IHotelRepository,
  ){}

  async execute(id: number, data: CreateReservationDto) {
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);
    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    if (checkInDate >= checkOutDate) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    const hotel = await this.hotelRepository.findHotelById(data.hotelId);
    if (!hotel){
      throw new NotFoundException('Hotel not found');
    }

    if (typeof hotel.price !== 'number' || hotel.price <= 0){
      throw new BadRequestException('Invalid hotel price');
    }

    const total = daysOfStay * hotel.price;

    const newReservation = {
      ...data,
      userId: id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      total,
    };

    return await this.reservationRepository.create(newReservation);

  }

}
