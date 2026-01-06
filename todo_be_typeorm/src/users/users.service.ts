import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    const isExist = await this.userRepo.findOne({ where: { email } });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    const passwordHash = await this.hashPassword(password);
    const createdUser = this.userRepo.create({
      email: email,
      name: name,
      password: passwordHash,
    });
    return this.userRepo.save(createdUser);
  }

  verifyPassword = async (password: string, passwordHash: string) => {
    return await argon2.verify(password, passwordHash);
  };

  findByEmail = async (email: string) => {
    return await this.userRepo.findOne({ where: { email: email } });
  };

  findById = async (id: number) => {
    return await this.userRepo.findOne({ where: { id: id } });
  };

  create(data: CreateUserDto) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userRepo.findOne({ where: { refreshToken: refreshToken } });
  };

  updateUserToken = async (refreshToken: string, userId) => {
    return await this.userRepo.update({ id: userId }, { refreshToken: refreshToken });
  };

  hashPassword = async (password: string) => {
    return await argon2.hash(password);
  };
}
