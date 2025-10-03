import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthForgotPasswordDTO {   
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}