import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateReservationService } from '../services/createReservation.service';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { FindAllReservationService } from '../services/findAllReservation.service';
import { FindByIdReservationService } from '../services/findByIdReservation.service';
import { FindByUserReservationService } from '../services/findByUserReservetion.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('reversations')
export class ReservationController {
  constructor(
    private readonly createReservationService: CreateReservationService,
    private readonly findAllReservationService: FindAllReservationService,
    private readonly findByIdReservationService: FindByIdReservationService,
    private readonly findByUserReservationService: FindByUserReservationService,
  ) {}

  @Post()
  create(@User('id') id: number, @Body() body: CreateReservationDto) {
    return this.createReservationService.execute(id , body);
  }

  @Get()
  findAll() {
    return this.findAllReservationService.execute();
  }
  
  @Get('user')
  findByUser(@User('id') id: number){
    return this.findByUserReservationService.execute(id);
  }

  @Get(':id')
  finById(@Param('id') id: number){
    return this.findByIdReservationService.execute(id);
  }


}
