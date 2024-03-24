import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  BadRequestException,
  Header,
  Redirect,
  Query,
  ParseIntPipe,
  HttpStatus,
  DefaultValuePipe,
  UseGuards,
  Headers,
  Inject,
  LoggerService,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { ValidationPipe } from '../validation.pipe';
import { UserInfo } from './UserInfo';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateUserCommand } from './command/users-create.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserInfoQuery } from './query/get-user-info.query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  private printWinstonLog(dto) {
    this.logger.error('error : ', JSON.stringify(dto));
    this.logger.warn('warn: ', JSON.stringify(dto));
    this.logger.verbose('verbose : ', JSON.stringify(dto));
    this.logger.debug('debug: ', JSON.stringify(dto));
  }
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    // this.printWinstonLog(createUserDto);
    // return this.usersService.createUser(createUserDto);
    const { name, email, password } = createUserDto;
    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Headers() headers: any, @Param('id') userId: string) {
    // if (+userId < 1) {
    //   throw new BadRequestException('id는 0보다 큰 정수여야 합니다.');
    // }
    // return this.usersService.getUserInfo(userId);
    console.log(userId);
    const getUserInfoQuery = new GetUserInfoQuery(userId);
    return this.queryBus.execute(getUserInfoQuery);
  }

  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    console.log(offset, limit);

    return this.usersService.findAll();
  }

  // @Get('/:id')
  // async GetUserInfo(@Param('id') userId: string): Promise<UserInfo> {

  //   return await this.usersService.getUserInfo(userId);
  // }
}
