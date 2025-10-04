import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class UserMatchGuard implements CanActivate {
    canActivate( context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const id = request.params.id;
        const user = request.user;

        if (user.id !== parseInt(id)) {
            throw new UnauthorizedException('You do not have permission to access this resource');
        }

        return true ; // o false según la lógica
    }
}