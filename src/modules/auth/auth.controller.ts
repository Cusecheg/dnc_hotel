import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDTO } from "./domain/dto/authLogin.dto";
import { AuthRegisterDTO } from "./domain/dto/authRegister.dto";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() body: AuthLoginDTO) {
        return this.authService.login(body);
    }

    @Post('register')
    register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }
}