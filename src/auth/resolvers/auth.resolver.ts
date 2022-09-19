import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RegisterUserInput } from '../../users/dto/register-user.input';
import { User } from '../../users/models/user.model';
import { AccessTokenOutput } from '../dto/access-token.output';
import { LoginInput } from '../dto/login.input';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => AccessTokenOutput)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => User)
  register(@Args('registerUserInput') registerUserInput: RegisterUserInput) {
    return this.authService.register(registerUserInput);
  }
}
