import Gender from './enums/gender.enum';

export interface IUpdateUser {
  nickname?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  aboutMe?: string;

  birthDate?: Date;

  gender?: Gender;
}
