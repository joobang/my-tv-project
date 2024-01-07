import { Controller, Get, Post, Body, Patch, Param, Delete, Res, BadRequestException, Header, Redirect, Query, ParseIntPipe, HttpStatus, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { ValidationPipe } from '../validation.pipe'
import { UserInfo } from './UserInfo';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
    
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto){
    return this.usersService.createUser(createUserDto);
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

  @Get('/:id')
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) userId: number){
    return this.usersService.findOne(userId);
  }

  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ){
    console.log(offset, limit);

    return this.usersService.findAll();
  }

  // @Get('/:id')
  // async GetUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    
  //   return await this.usersService.getUserInfo(userId);
  // }

}
