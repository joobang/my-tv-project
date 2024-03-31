import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CretaeUserHandler } from './handler/users-create.handler';
import { GetUserInfoQueryHandler } from './query/get-user-info.handler';
import { UserEventsHandler } from './application/event/user-events.handler';

@Module({
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    Logger,
    UserEventsHandler,
    CretaeUserHandler,
    GetUserInfoQueryHandler,
  ],
})
export class UsersModule {}
