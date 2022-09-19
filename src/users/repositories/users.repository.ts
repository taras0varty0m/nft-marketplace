import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RegisterUserInput } from '../dto/register-user.input';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(registrationData: RegisterUserInput) {
    return this.save(this.create(registrationData));
  }
}
