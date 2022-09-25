import { Injectable } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { IUpdateUser } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findOneById(id: UserEntity['id']): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(updateUserData: IUpdateUser, userId: UserEntity['id']) {
    await this.userRepository.update(userId, updateUserData);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['assets'],
    });

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const deleteResult = await this.userRepository.delete(userId);

    return Boolean(deleteResult.affected);
  }
}
