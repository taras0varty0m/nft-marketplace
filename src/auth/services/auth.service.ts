import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterUserInput } from '../../users/dto/register-user.input';
import { UsersService } from '../../users/services/users.service';
import { LoginInput } from '../dto/login.input';
import { JwtPayload } from '../jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registrationData: RegisterUserInput) {
    const isDuplicateUser = await this.usersService.count({
      where: [
        { email: registrationData.email },
        { nickname: registrationData.nickname },
      ],
    });

    if (isDuplicateUser) {
      throw new ConflictException('email or nickname already exist');
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = await this.usersService.createUser({
      ...registrationData,
      password: hashedPassword,
    });

    return createdUser;
  }

  async login(loginInput: LoginInput) {
    const { nickname, password } = loginInput;

    const user = await this.usersService.findOne({
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
