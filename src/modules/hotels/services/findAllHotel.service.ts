import { Inject, Injectable } from '@nestjs/common';
import { HOTEL_TOKEN_REPOSITORY } from '../utils/hotel.token.repository';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';
import { Hotel } from '@prisma/client';


@Injectable()
export class FindAllHotelService {
 constructor(
    @Inject(HOTEL_TOKEN_REPOSITORY)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis()
    private readonly redis: Redis,
 ){}
  async execute( page: number, limit: number ) {
    const offSet = (page - 1) * limit;

    const dataRedis = await this.redis.get(REDIS_HOTEL_KEY)

    let data: any;

    if (dataRedis) {
        data = JSON.parse(dataRedis);
    }else{
      data = null
    }
    
    if (!data){
      data = await this.hotelRepositories.findHotels(offSet, limit);
      data = data.map((hotel: Hotel) => {
        if (hotel.image){
          hotel.image = `${process.env.APP_API_URL}/upload-hotels/${hotel.image}`
        }

        return hotel
      })

      await this.redis.set(REDIS_HOTEL_KEY, JSON.stringify(data))
    }
      
    const total = await this.hotelRepositories.hotelsCount();

    return {
      total,
      page,
      per_page: limit,
      data
    }
  }

}
