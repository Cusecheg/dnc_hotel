import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "generated/prisma";

@Injectable()
export class UserService {
    constructor(private readonly prisma : PrismaService) {}
    
    async create(body: any): Promise<User> {
        return await this.prisma.user.create({data: body})
    }
    
    async list() {
        return await this.prisma.user.findMany();
    }

    async show(id: string) {
        const user = await this.isUserExist(id);
        return user;
    }

    async update(id: string, body: any) {
        await this.isUserExist(id);
        return await this.prisma.user.update({where: {id: Number(id)}, data: body})
    }

    async delete(id: string) {
        await this.isUserExist(id);
        return await this.prisma.user.delete({ where: {id: Number(id)} });
    }

    private async isUserExist(id: string){
        const user = await this.prisma.user.findUnique({where: {id: Number(id)}});
        if (!user){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        return user
    }
}