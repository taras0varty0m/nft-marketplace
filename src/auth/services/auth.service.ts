import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/repositories/users.repository';

import { JwtPayload } from '../jwt/jwt-payload.interface';
import { ILoginUser, IRegisterUser } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registrationData: IRegisterUser) {
    const isDuplicateUser = await this.usersRepository.findOne({
      where: [
        { email: registrationData.email },
        { nickname: registrationData.nickname },
      ],
      select: ['id'],
    });

    if (isDuplicateUser) {
      throw new ConflictException('email or nickname already exist');
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = await this.usersRepository.createUser({
      ...registrationData,
      password: hashedPassword,
    });

    return createdUser;
  }

  async login(loginData: ILoginUser) {
    const { nickname, password } = loginData;

    const user = await this.usersRepository.findOne({
      where: { nickname },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    await this.verifyPassword(password, user.password);

    const payload: JwtPayload = { userId: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid password');
    }
  }
}
