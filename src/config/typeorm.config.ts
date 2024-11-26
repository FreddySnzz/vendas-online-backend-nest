import { TypeOrmModuleOptions } from '@nestjs/typeorm';

class TypeOrmService {
  public getTypeormConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      // autoLoadEntities: true,
      // migrations: [`src/migrations/*{.ts, .js}`],
      entities: [`${__dirname}/../**/*.entity.{js,.ts}`],
      synchronize: true,
    };
  }
}

const typeOrmService = new TypeOrmService();
export { typeOrmService };
