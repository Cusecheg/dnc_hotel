import { createParamDecorator, ExecutionContext } from "@nestjs/common";



export const priceDecorator = createParamDecorator((_data : unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const price = parseFloat(request.body.price); 
    return price;

})