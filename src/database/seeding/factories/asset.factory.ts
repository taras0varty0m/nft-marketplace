import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { AssetEntity } from '../../../assets/entities/asset.entity';

define(AssetEntity, () => {
  const asset = new AssetEntity();
  asset.category = faker.random.word();
  asset.imageUrl = faker.image.imageUrl();
  asset.description = faker.lorem.sentence();
  asset.price = +faker.random.numeric();
  asset.title = faker.lorem.sentence();
  return asset;
});
