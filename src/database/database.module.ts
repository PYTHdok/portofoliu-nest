import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lucrare } from '../lucrari/lucrare.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Lucrare],
      synchronize: true, // foloseste false in productie
      logging: true,
    }),
  ],
})
export class DatabaseModule {}