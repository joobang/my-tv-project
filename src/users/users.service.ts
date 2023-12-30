import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService){}

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string){
    return false;
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string){
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string){
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken)
  }

  async verifyEmail(signupVerifyToken: string): Promise<string>{
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러
    // 2. 바로 로그인 상태가 되도록 JWT를 발급

    throw new Error('Method not impolemented.');
  }

  async login(email: string, password: string): Promise<string>{
    //Todo
    // 1. email, pw를 가진 유저가 존재하는지 db에서 확인하고 없다면 에러처리
    // 2. JWT 발급

    throw new Error('Method not implemented.');
  }

  async getUserInfo(userId: string): Promise<UserInfo>{
    //Todo
    // 1. userId를 가진 유저가 존재하는지 db에서 확인하고 없다면 에러처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답

    throw new Error('Method not implemented.');
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
