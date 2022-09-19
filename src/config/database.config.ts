import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('database', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    logging: Boolean(process.env.POSTGRES_LOGGING) || false,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: Boolean(process.env.POSTGRES_SYNCHRONIZE) || false,
    autoLoadEntities: true,
    entities: [join(__dirname, '..', '/**/**/*.entity{.ts,.js}')],
    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  };
});
