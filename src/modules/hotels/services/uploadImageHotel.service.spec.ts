import { Hotel } from "@prisma/client";
import { IHotelRepository } from "../domain/repositories/Ihotel.repository";
import { UploadImageHotelService } from "./uploadImageHotel.service"
import { Test, TestingModule } from "@nestjs/testing";
import { HOTEL_TOKEN_REPOSITORY } from "../utils/hotel.token.repository";
import { NotFoundException } from "@nestjs/common";
import { stat, unlink } from "fs/promises";
import { join, resolve } from "path";
import { REDIS_HOTEL_KEY } from "../utils/redisKey";


let service: UploadImageHotelService;
let hotelRepository: IHotelRepository; 
let redis: { del: jest.Mock }

const hotelMock: Hotel = {
  id: 1,
  name: 'Hotel Test',
  description: 'A hotel for testing',
  address: '123 Test',
  image: 'test.jpg',
  price: 100,
  ownerId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
}

jest.mock( 'fs/promises', () => ({
  stat: jest.fn(),
  unlink: jest.fn(),
}))


describe('UploadImageHotelService', () => {
  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadImageHotelService,
        {
          provide: HOTEL_TOKEN_REPOSITORY,
          useValue: {
            findHotelById: jest.fn().mockResolvedValue(hotelMock),
            update: jest.fn().mockResolvedValue(hotelMock)
          },
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            del: jest.fn(),
          },
        },

      ]
    }).compile()

    service = module.get<UploadImageHotelService>(UploadImageHotelService);
    hotelRepository = module.get<IHotelRepository>(HOTEL_TOKEN_REPOSITORY);
    redis = module.get('default_IORedisModuleConnectionToken')
  })


  it('should be difined', () => {
    expect(service).toBeDefined();
  })

  it('should throw NotFoundException if hotel does not exist', async () => {
    (hotelRepository.findHotelById as jest.Mock).mockResolvedValue(null);
    const result = service.execute(1, 'test.jpg')
    await expect(result).rejects.toThrow(NotFoundException)
  })

  it('should delete existing image if it exists', async () => {
    (stat as jest.Mock).mockResolvedValue(true);
    (unlink as jest.Mock).mockResolvedValue(true);

    await service.execute(1, 'test.jpg')

    const directory = resolve(process.cwd(), 'uploads-hotels');

    if(hotelMock.image){
      const imageHotelFilePath = join(directory, hotelMock.image)
      
      expect(stat).toHaveBeenCalledWith(imageHotelFilePath);
      expect(unlink).toHaveBeenCalledWith(imageHotelFilePath)
    }
    
  })

  it('should not throw if existing image does not exist', async () => {
    (stat as jest.Mock).mockResolvedValue(null);

    const result = service.execute(1, 'test.jpg')

    await expect(result).resolves.not.toThrow();
  })

  it('should update the hotel with the new image', async () => {

    await service.execute(1, 'test.jpg')

    expect(hotelRepository.update).toHaveBeenCalledWith(1 , {
      image: 'test.jpg'
    })

  })

  it('should delete the redis cache key', async () => {
    await service.execute(1, 'test.jpg')

    expect(redis.del).toHaveBeenCalledWith(REDIS_HOTEL_KEY)
  })

})

