import { Test, TestingModule } from "@nestjs/testing";
import { HOTEL_TOKEN_REPOSITORY } from "../utils/hotel.token.repository";
import { CreateHotelService } from "./createHotel.service";
import { IHotelRepository } from "../domain/repositories/Ihotel.repository";
import { FindAllHotelService } from "./findAllHotel.service";
import { REDIS_HOTEL_KEY } from "../utils/redisKey";
import { create } from "domain";

let service: CreateHotelService;
let hotelRepository: IHotelRepository;
let redis: { del: jest.Mock };

const createHotelMock = {
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

describe('CreateHotelService', () => {

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [ 
        CreateHotelService,
        {
          provide: HOTEL_TOKEN_REPOSITORY,
          useValue: {
            create: jest.fn().mockResolvedValue(createHotelMock),
          },
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            del: jest.fn(),
          },
        },
        {
          provide: FindAllHotelService,
          useValue: {
            execute: jest.fn(),
          },
        }
      ]
    }).compile();

    service = module.get<CreateHotelService>(CreateHotelService);
    hotelRepository = module.get<IHotelRepository>(HOTEL_TOKEN_REPOSITORY);
    redis = module.get<any>('default_IORedisModuleConnectionToken');

  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete the redis key', async () => {


    const hotelMock = await service.execute(createHotelMock)

    if (hotelMock){
      const redisDelSpy = jest.spyOn(redis, 'del').mockResolvedValue(1);

      expect(redisDelSpy).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
    }

    
  });


    it('should create a hotel', async () => {

     const result = await service.execute(createHotelMock);

      expect(hotelRepository.create).toHaveBeenCalledWith(createHotelMock);

      expect(result).toEqual(createHotelMock);
  });

 
}); 