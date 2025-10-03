import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";
import { AuthLoginDTO } from "./domain/dto/authLogin.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { UserService } from "../users/user.service";
import { AuthRegisterDTO } from "./domain/dto/authRegister.dto";
import { CreateUserDTO } from "../users/domain/dto/createUser.dto";



@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async generateToken(user: User){
        const payload = { sub: user.id, name: user.name };
        const options = { 
            expiresIn: '1h',
            issuer: 'dnc_hotel',
            audience: 'users'
         }; 
        return {access_token: this.jwtService.sign(payload, options)};
    }

    async login({ email, password }: AuthLoginDTO){
        const user = await this.userService.findByEmail(email);
        if (!user || (await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user);
    }

    async register(body: AuthRegisterDTO){

        const newUser: CreateUserDTO = {
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role ?? Role.USER,
        };
        const user = await this.userService.create(newUser);
        return this.generateToken(user);
    }
}