import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/graphql-jwt-auth.guard';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserProfileOutput } from '../dto/user-profile.output';
import { UserEntity } from '../entities/user.entity';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserProfileOutput)
  async getUserProfile(@Args('id', { type: () => String }) id: string) {
    const user = await this.usersService.findOne({ where: { id } });

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }

  @Mutation(() => UserProfileOutput)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() { id: userId }: UserEntity,
  ) {
    return this.usersService.updateUser(updateUserInput, userId);
  }

  @Mutation(() => Boolean)
  async deleteCurrentUser(@CurrentUser() { id: userId }: UserEntity) {
    return this.usersService.deleteUser(userId);
  }
}
