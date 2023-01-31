import { DataSource } from 'typeorm';
import { Product } from './entities/Product';
import { User } from './entities/User';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: (<unknown>process.env.DB_PORT) as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, User],
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
});
