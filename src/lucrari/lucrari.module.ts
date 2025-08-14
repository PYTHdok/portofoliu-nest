import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LucrariController } from './lucrari.controller';
import { LucrariService } from './lucrari.service';
import { Lucrare } from './lucrare.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lucrare])],
  controllers: [LucrariController],
  providers: [LucrariService]
})
export class LucrariModule {}
