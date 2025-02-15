import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [TaskEntity, UserEntity],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
});
