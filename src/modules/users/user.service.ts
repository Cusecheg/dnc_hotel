import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { CreateUserDTO } from "./domain/dto/createUser.dto";
import { UpdateUserDTO } from "./domain/dto/updateUser.dto";
import * as bcrypt from 'bcrypt';
import { userSelectFields } from "../prisma/utils/userSelectFields";
import { join, resolve } from "path";
import { stat, unlink } from "fs/promises";

@Injectable()
export class UserService {
    constructor( private readonly prisma : PrismaService) {}
    
    async create(body: CreateUserDTO): Promise<User> {

        const userExists = await this.prisma.user.findUnique({ where: { email: body.email } });
        if (userExists){
            throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
        }

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
        return await this.prisma.user.findUnique({ where: { email }});
    }

    async uploadAvatar(id: Number, avatarFileName: string) {
        const user = await this.isUserExist(Number(id));
        const directory = resolve(process.cwd(), 'uploads/avatars');

        if (user.avatar) {
            const userAvatarFilePath = join(directory, user.avatar);
        try {
            await stat(userAvatarFilePath);
            await unlink(userAvatarFilePath);
        } catch (err) {
            if (err.code !== 'ENOENT') throw err; // Solo ignora si el archivo no existe
        }
    }
        const userUpdated = await this.update(Number(id), { avatar: avatarFileName });
        return userUpdated;
    }

    private async isUserExist(id: number){
        const user = await this.prisma.user.findUnique({where: { id }, select: userSelectFields});
        if (!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        return user
    }
}