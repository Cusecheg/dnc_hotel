import { Module } from '@nestjs/common';
import { HotelsController } from './infra/hotels.controller';
import { CreateHotelService } from './services/createHotel.service';
import { FindAllHotelService } from './services/findAllHotel.service';
import { FindOneHotelService } from './services/findOneHotel.service';
import { RemoveHotelService } from './services/removeHotel.service';
import { UpdateHotelService } from './services/updateHotel.service';
import { HotelsRepositories } from './infra/hotels.repository';
import { PrismaModule } from '../prisma/prisma.model';
import { FindByNameHotelService } from './services/findByNameHotel.service';
import { FindByOwnerHotelService } from './services/findByOwnerHotel.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [HotelsController],
  providers: [
    CreateHotelService,
    FindAllHotelService,
    FindByNameHotelService,
    FindByOwnerHotelService,
    FindOneHotelService,
    UpdateHotelService,
    RemoveHotelService,
    {
      provide: 'HOTEL_REPOSITORIES_TOKEN',
      useClass: HotelsRepositories,
    }
  ],
})
export class HotelsModule {}
