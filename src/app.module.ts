import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LucrariModule } from './lucrari/lucrari.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    DatabaseModule,
    LucrariModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
