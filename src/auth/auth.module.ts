import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/entities/user.entity';
import { RefreshTokenSchema } from './entities/refresh-token.entity';
import { ResetToken, ResetTokenSchema } from './entities/reset-token.schema';
import { MailService } from '../services/mail.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'RefreshToken',
        schema: RefreshTokenSchema,
      },
      {
        name: ResetToken.name,
        schema: ResetTokenSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
