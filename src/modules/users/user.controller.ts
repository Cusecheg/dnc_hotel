import { Controller, Get, Post, Patch, Body, Param, Delete, ParseIntPipe, UseInterceptors, Res, UseGuards, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./domain/dto/createUser.dto";
import { UpdateUserDTO } from "./domain/dto/updateUser.dto";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { User } from "src/shared/decorators/user.decorator";
import { Role, type User as UserType } from "@prisma/client";
import { Roles } from "src/shared/decorators/roles.decotaror";
import { RoleGuard } from "src/shared/guards/role.guard";
import { UserMatchGuard } from "src/shared/guards/userMatch.guard";
import { ThrottlerGuard } from "@nestjs/throttler";
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')

export class UserController {
    constructor( private userService: UserService ) {}
    
    @UseGuards(ThrottlerGuard)
    @Get()
    list(@User('email') user: UserType){
        console.log(user);
        return this.userService.list();
    }

    @Get(':id')
    show(@Param('id', ParseIntPipe) id : number){
        return this.userService.show(id);
    }
    
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() body : CreateUserDTO){
        return this.userService.create(body)
    }

    @UseGuards(UserMatchGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id : number, @Body() body : UpdateUserDTO){
        return this.userService.update(id, body)
    }

    @UseGuards(UserMatchGuard)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id : number){
        return this.userService.delete(id)
    }


}