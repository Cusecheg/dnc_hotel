import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { CreateUserDTO } from "./domain/dto/createUser.dto";
import { UpdateUserDTO } from "./domain/dto/updateUser.dto";
import * as bcrypt from 'bcrypt';
import { userSelectFields } from "prisma/utils/userSelectFields";

@Injectable()
export class UserService {
    constructor( private readonly prisma : PrismaService) {}
    
    async create(body: CreateUserDTO): Promise<User> {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;
        return await this.prisma.user.create({data: body, select: userSelectFields});

    }
    
    async list() {
        return await this.prisma.user.findMany({
            select: userSelectFields
        });
    }

    async show(id: number) {
        const user = await this.isUserExist(id);
        return user;
    }

    async update(id: number, body: UpdateUserDTO) {
        await this.isUserExist(id);
        return await this.prisma.user.update({where: { id }, data: body, select: userSelectFields})
    }

    async delete(id: number) {
        await this.isUserExist(id);
        return await this.prisma.user.delete({ where: { id } });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email }, select: userSelectFields });
    }

    private async isUserExist(id: number){
        const user = await this.prisma.user.findUnique({where: { id }, select: userSelectFields});
        if (!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        return user
    }
}