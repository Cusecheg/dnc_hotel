
import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";


export const User = createParamDecorator((filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
        throw new NotFoundException('User not found');
    }

    if (filter) {
        if (!user[filter]) {
            throw new NotFoundException(`User ${filter} not found`);
        }
        return user[filter]; // Devuelve solo el campo solicitado
    }

    return user; // Devuelve el objeto completo si no se especifica un filtro
});