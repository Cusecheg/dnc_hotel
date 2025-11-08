
import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const User = createParamDecorator((filter: string, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    const body = context.switchToHttp().getRequest().body;

    if (!user) throw new NotFoundException('User not found');

    if (filter){
        if (!user[filter]){
            throw new NotFoundException(`User ${filter} not found`);
        }
        if (body){
            body.ownerId = user.id;
        }
        return user[filter];
    }
    
    return user;
})