import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HOTEL_TOKEN_REPOSITORY } from '../utils/hotel.token.repository';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repository';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';


@Injectable()
export class UploadImageService {
  constructor(
    @Inject(HOTEL_TOKEN_REPOSITORY)
    private readonly hotelRepositories: IHotelRepository,
  ){}
  async execute(id: number, imageFileName: string) {

    const hotel = await this.hotelRepositories.findHotelById(id);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    const directory = resolve(process.cwd(), 'uploads-hotels');
    console.log(`directory: ${directory} `)
    if (hotel.image) {
        const hotelImageFilePath = join(directory, hotel.image);
    try {
        await stat(hotelImageFilePath);
        await unlink(hotelImageFilePath);
        console.log('Archivo de imagen anterior eliminado:', hotel.image);
    } catch (err) {
        if (err.code !== 'ENOENT') throw err; // Solo ignora si el archivo no existe
    }
    }
    return await this.hotelRepositories.update( id, 
      {
        image: imageFileName
      });
  
}}
