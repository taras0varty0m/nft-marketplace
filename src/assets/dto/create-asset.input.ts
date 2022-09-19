import { Field, InputType } from '@nestjs/graphql';
import { IsPositive, Length } from 'class-validator';

import { IsImageUrl } from '../../common/input-validation/is-image-url.decorator';

@InputType()
export class CreateAssetInput {
  @Field()
  @IsImageUrl({ message: 'Must be a valid image URL' })
  imageUrl: string;

  @Field()
  @Length(1, 255, {
    message: 'Title length must be between 1 and 255 characters',
  })
  title: string;

  @Field()
  @Length(1, 1000, {
    message: 'Description length must be between 1 and 1000 characters',
  })
  description: string;

  @Field()
  @Length(1, 255, {
    message: 'Category length must be between 1 and 255 characters',
  })
  category: string;

  @Field()
  @IsPositive()
  price: number;
}
