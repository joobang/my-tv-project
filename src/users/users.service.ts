import * as uuid from 'uuid';
import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { NotFoundError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    private authService: AuthService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ){}
  
  async createUser(createUserDto: CreateUserDto) {
    //console.log(createUserDto);
    const userExist = await this.checkUserExists(createUserDto.email);
    //console.log(userExist);
    if(userExist){
      console.log(userExist);
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }
    const signupVerifyToken = uuid.v1();
    //await this.saveUser(createUserDto.name, createUserDto.email, createUserDto.password, signupVerifyToken);
    //await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
    //await this.saveUserUsingQueryRunner(createUserDto.name, createUserDto.email, createUserDto.password, signupVerifyToken);
    await this.saveUserUsingTransaction(createUserDto.name, createUserDto.email, createUserDto.password, signupVerifyToken);

    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
  }

  private async checkUserExists(email: string){
    const user = await this.userRepository.findOne({
      where: {email : email}
    })
    
    return user;
  }

  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string){
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      await queryRunner.manager.save(user);
      
      //throw new InternalServerErrorException();

      await queryRunner.commitTransaction();

    }catch(error){
      await queryRunner.rollbackTransaction();
    } finally{
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string){
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
      console.log('Transaction will be committed');
    });
    console.log('Transaction completed');
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string){
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.userRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string){
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken)
  }

  async verifyEmail(signupVerifyToken: string): Promise<string>{
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken }
    });
    console.log(user);
    if (!user) {
      throw new NotFoundException('user가 존재 하지 않습니다.');
    }
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string>{
    //Todo
    // 1. email, pw를 가진 유저가 존재하는지 db에서 확인하고 없다면 에러처리
    const user = await this.userRepository.findOne({
      where: { email, password }
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    // 2. JWT 발급
    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  async getUserInfo(userId: string): Promise<UserInfo>{
    //Todo
    // 1. userId를 가진 유저가 존재하는지 db에서 확인하고 없다면 에러처리
    const user = await this.userRepository.findOne({
      where: { id : userId }
    });
    if (!user) {
      throw new NotFoundException('user가 존재 하지 않습니다.');
    }
    // 2. 조회된 데이터를 UserInfo 타입으로 응답
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };

  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
