import { Body, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";
import { AuthLoginDTO } from "./domain/dto/authLogin.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { UserService } from "../users/user.service";
import { AuthRegisterDTO } from "./domain/dto/authRegister.dto";
import { CreateUserDTO } from "../users/domain/dto/createUser.dto";
import { AuthResetPasswordDTO } from "./domain/dto/authResetPassword.dto";
import { AuthForgotPasswordDTO } from "./domain/dto/authForgotPassword.dto";



@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async generateToken(user: User, expiresIn = '1h') {
        const payload = { sub: user.id, name: user.name };
        const options = { 
            expiresIn: expiresIn,
            issuer: 'dnc_hotel',
            audience: 'users'
         }; 
        return {access_token: this.jwtService.sign(payload, options)};
    }

    async login({ email, password }: AuthLoginDTO){
        const user = await this.userService.findByEmail(email);

        if (!user || !await bcrypt.compare(password, user.password)) {
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

    async reset({ token, password }: AuthResetPasswordDTO){
        const { valid, decoded } = await this.validateToken(token);

        if (!valid) throw new UnauthorizedException('Invalid or expired token');
        
        const user = await this.userService.update(decoded.sub, { password: await bcrypt.hash(password, 10) });

        return user;
    }

    async forgot({email}: AuthForgotPasswordDTO){
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Email not found');

        const token = this.generateToken(user, '30m')

        return token;
    }

    async validateToken(token: string){
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
                issuer: 'dnc_hotel',
                audience: 'users'
            });
            return { valid: true, decoded };
        } catch (e) {
            return { valid: false, message: e.message };
        }
    }
}