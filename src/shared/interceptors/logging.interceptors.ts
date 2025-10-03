import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";




export class loggingInterceptors implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        const now = Date.now();
        return next
            .handle()
            .pipe(
                finalize(() => {
                    const request = context.switchToHttp().getRequest();
                    console.log(`Url: ${request.url}`);
                    console.log(`After... ${Date.now() - now}ms`)
                    })
            );
    }
}