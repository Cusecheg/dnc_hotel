import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateHotelDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    description: string;

    @IsString()
    @MaxLength(255)
    @IsOptional()
    image?: string;

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()  // Asegura que el valor sea un número
    price: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    address: string;

    @IsNumber()
    @IsNotEmpty()
    ownerId: number;
}


