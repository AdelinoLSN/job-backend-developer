import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class DatabaseHelper {
  static async createDatabase(name: string) {
    const tempModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: 'mysql',
        }),
      ],
    }).compile();

    const tempDataSource = tempModule.get<DataSource>(DataSource);
    await tempDataSource.query('CREATE DATABASE ' + name);
    await tempDataSource.destroy();
    tempModule.close();
  }

  static async cleanDatabase(dataSource: DataSource) {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('TRUNCATE TABLE movie_review');
    await dataSource.query('TRUNCATE TABLE movie_director');
    await dataSource.query('TRUNCATE TABLE movie_actor');
    await dataSource.query('TRUNCATE TABLE movie');
    await dataSource.query('TRUNCATE TABLE director');
    await dataSource.query('TRUNCATE TABLE actor');
    await dataSource.query('TRUNCATE TABLE person');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  static async dropDatabase(dataSource: DataSource, name: string) {
    await dataSource.query('DROP DATABASE ' + name);
  }
}
