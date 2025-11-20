import { Test, TestingModule } from "@nestjs/testing";
import { IHotelRepository } from "../domain/repositories/Ihotel.repository";
import { FindAllHotelService } from "./findAllHotel.service";
import { HOTEL_TOKEN_REPOSITORY } from "../utils/hotel.token.repository";
import { Hotel } from "@prisma/client";
import { REDIS_HOTEL_KEY } from "../utils/redisKey";

let service: FindAllHotelService;
let hotelRepository: IHotelRepository;
let redis: { get: jest.Mock, set: jest.Mock };

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


describe('FindAllHotelService', () => {

  beforeEach(async () => { 

        const module: TestingModule = await Test.createTestingModule({
          providers: [ 
            FindAllHotelService,
            {
              provide: HOTEL_TOKEN_REPOSITORY,
              useValue: {
                findHotels: jest.fn().mockResolvedValue([hotelMock]),
                hotelsCount: jest.fn(),

              },
            },
            {
              provide: 'default_IORedisModuleConnectionToken',
              useValue: {
                get: jest.fn(),
                set: jest.fn(),
              },
            },

          ]
        }).compile();
    
        service = module.get<FindAllHotelService>(FindAllHotelService);
        hotelRepository = module.get<IHotelRepository>(HOTEL_TOKEN_REPOSITORY);
        redis = module.get<any>('default_IORedisModuleConnectionToken');

  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  
  });

  it('should return a list of hotels from redis cache', async () => {
    const redisData = [hotelMock];
    redis.get.mockResolvedValue(JSON.stringify(redisData));

    const result = await service.execute(1, 10);

    result.data.forEach((hotel: Hotel) => {
      hotel.createdAt = new Date(hotel.createdAt);
      hotel.updatedAt = new Date(hotel.updatedAt);
    })

    expect(redis.get).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
    expect(result.data).toEqual(redisData)
  })

  it('should fetch hotels from repository if not exist in Redis cache', async () => {
    redis.get.mockResolvedValue(null);

    (hotelRepository.findHotels as jest.Mock).mockResolvedValue([hotelMock]);
    (hotelRepository.hotelsCount as jest.Mock).mockResolvedValue(1)

    const result = await service.execute(1, 10)

    expect(redis.get).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
    expect(hotelRepository.findHotels).toHaveBeenCalledWith(0, 10);
    expect(redis.set).toHaveBeenCalledWith(REDIS_HOTEL_KEY, JSON.stringify([hotelMock]));
    expect(result.data).toEqual([hotelMock]);
    expect(result.total).toEqual(1);
    expect(result).toEqual({
      data: [hotelMock],
      page: 1,
      per_page: 10,
      total: 1,
    })

  })

  it ('should return the correct pagination metadata', async () => {
    redis.get.mockResolvedValue(null);
    (hotelRepository.findHotels as jest.Mock).mockResolvedValue([hotelMock]);
    (hotelRepository.hotelsCount as jest.Mock).mockResolvedValue(1);

    const page = 2;
    const limit = 5;
    const result = await service.execute(page, limit)

    expect(hotelRepository.findHotels).toHaveBeenCalledWith(5, 5);
    expect(result.page).toEqual(page);
    expect(result.per_page).toEqual(limit)


  })

it('should format hotel images URLs correctly', async () => {

  process.env.APP_API_URL = 'http://localhost:3000'

  redis.get.mockResolvedValue(null);
  
  // Asegúrate de que el campo 'image' esté correctamente definido en hotelWithImage
  const hotelWithImage = { ...hotelMock, image: 'test.jpg' };
  
  // Mockea la función del repositorio
  (hotelRepository.findHotels as jest.Mock).mockResolvedValue([hotelWithImage]);
  (hotelRepository.hotelsCount as jest.Mock).mockResolvedValue(1);

  // Ejecuta el servicio
  const result = await service.execute(0, 10);

  // Compara la URL de la imagen generada
  expect(result.data[0].image).toEqual(`http://localhost:3000/upload-hotels/test.jpg`);
});

  
  // it('should format hotel images URLs correctly', async () => {
  //   process.env.APP_API_URL = 'http://localhost:3000';  // Establecer la variable de entorno para los tests

  //   redis.get.mockResolvedValue(null);

  //   // Aquí estamos mockeando correctamente el repositorio y la función `findHotels`
  //   (hotelRepository.findHotels as jest.Mock).mockResolvedValue([hotelMock]);
  //   (hotelRepository.hotelsCount as jest.Mock).mockResolvedValue(1);

  //   const result = await service.execute(0, 10);

  //   // Asegúrate de que la URL de la imagen sea correcta
  //   expect(result.data[0].image).toEqual(`${process.env.APP_API_URL}/uploads-hotels/${hotelMock.image}`);
  // });



});
