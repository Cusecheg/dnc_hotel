import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.model';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ThrottlerModule.forRoot([
    {
    ttl: 5000,
    limit: 3,
  },
  ]),
],
  providers: [
    { provide: 'APP_GUARD', useClass: ThrottlerModule }
  ],
})
export class AppModule {}
