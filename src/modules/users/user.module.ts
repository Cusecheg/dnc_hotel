import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaModule } from "../prisma/prisma.model";
import { AuthModule } from "../auth/auth.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { CustomFileValidator } from "src/shared/interceptors/custom-file.validator";

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule), 
    MulterModule.register({
        storage: diskStorage({
            destination: './uploads/avatars',
            filename: async (req, file, cb) => {
                const { v4: uuidv4 } = await import ('uuid'); // <-- esto NO debe estar
                const filename = `${uuidv4()}-${file.originalname}`;   
                cb(null, filename);
        },})
    })],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule {} 