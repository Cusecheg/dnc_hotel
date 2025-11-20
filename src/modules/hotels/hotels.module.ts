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
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadImageHotelService } from './services/uploadImageHotel.service';
import { HOTEL_TOKEN_REPOSITORY } from './utils/hotel.token.repository';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [PrismaModule, AuthModule, UserModule,
    MulterModule.register({
        storage: diskStorage({
            destination: './uploads-hotels',
            filename: async (req, file, cb) => {
                console.log('Generating file name for hotel image...');
                const filename = `${uuidv4()}-${file.originalname}`;   
                console.log('Saving hotel image with filename:', filename, 'originalName:', file.originalname, 'mimetype:', file.mimetype);
                cb(null, filename);
        }},  ),

    })
  ],
  controllers: [HotelsController],
  providers: [
    CreateHotelService,
    FindAllHotelService,
    FindByNameHotelService,
    FindByOwnerHotelService,
    FindOneHotelService,
    UpdateHotelService,
    UploadImageHotelService,
    RemoveHotelService,
    {
      provide: HOTEL_TOKEN_REPOSITORY,
      useClass: HotelsRepositories,
    }
  ],
})
export class HotelsModule {}
