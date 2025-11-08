import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.model';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { from } from 'rxjs';
import { HotelsModule } from './modules/hotels/hotels.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ThrottlerModule.forRoot([
    {
    ttl: 5000,
    limit: 3,
  },
  ]),
  MailerModule.forRoot({
    transport: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
    defaults: {
      from: `"dnc_hotel" <${process.env.MAILER_FROM}>`,
    }
  }),
  HotelsModule
],
  providers: [
    { provide: 'APP_GUARD', useClass: ThrottlerModule }
  ],
})
export class AppModule {}
