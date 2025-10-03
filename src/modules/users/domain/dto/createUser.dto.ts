import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Role } from "@prisma/client";


export class CreateUserDTO {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(Role)
    role: Role;
}