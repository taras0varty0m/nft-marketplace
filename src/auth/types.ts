import Gender from 'src/users/enums/gender.enum';

export interface IRegisterUser {
  nickname: string;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  birthDate: Date;

  gender?: Gender;
}

export interface ILoginUser {
  nickname: string;

  password: string;
}
