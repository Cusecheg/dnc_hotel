
import { $Enums, ReservationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UpdateStatusReservationDto {
    @Transform(({ value }) => (value ? String(value).toUpperCase() : value))
    @IsEnum(ReservationStatus)
    status: ReservationStatus;
}
