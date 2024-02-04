import { Controller, Get, Post, Body, Patch, Param, Delete, Res, BadRequestException, Header, Redirect, Query, ParseIntPipe, HttpStatus, DefaultValuePipe, UseGuards, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { ValidationPipe } from '../validation.pipe'
import { UserInfo } from './UserInfo';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthService } from 'src/auth/auth.service';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}
    
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

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Headers() headers: any, @Param('id') userId: string){
    return this.usersService.getUserInfo(userId);
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
