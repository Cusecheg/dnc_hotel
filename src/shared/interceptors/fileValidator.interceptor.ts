import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, throwError } from "rxjs";
import { unlink } from "fs";


@Injectable()
export class FileValidatorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            catchError((err) => {
                if (err instanceof BadRequestException) {
                    const request = context.switchToHttp().getRequest();
                    const file = request.file;
                    if (file) {
                        unlink(file.path, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting file:', unlinkErr);
                            } else {
                                console.log('File deleted successfully');
                            }
                    });
                }
            }
        
            return throwError(() => err)
        })
        )
    }
}