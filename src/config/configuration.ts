import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const validationSchema = Joi.object<ConfigurationSchema>({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_LOGGING: Joi.boolean().required(),
  POSTGRES_SYNCHRONIZE: Joi.boolean().required(),

  ENABLE_GRAPHQL_PLAYGROUND: Joi.boolean().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.alternatives().try(Joi.number(), Joi.string()).required(),

  PORT: Joi.number().optional(),
});

export interface ConfigurationSchema {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_LOGGING: boolean;
  POSTGRES_SYNCHRONIZE: boolean;

  ENABLE_GRAPHQL_PLAYGROUND: boolean;

  JWT_SECRET: string;
  JWT_EXPIRY: string | number;

  PORT?: number;
}

export class AppConfigService extends ConfigService<
  ConfigurationSchema,
  true
> {}
