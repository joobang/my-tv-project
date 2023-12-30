import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './email.service';

@Module({
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}
