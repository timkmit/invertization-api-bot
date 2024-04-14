import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { ProductModule } from '../product/product.module';
import { PrismaService } from 'src/prisma.service';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';

const sessions = new LocalSession({ database: 'session_db.json' });
//TODO add .env
@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: '7082382955:AAFR4KwRh2LW0OBsEcYzOlLgnQFxZ685yao',
    }),
    ProductModule,
    CategoryModule
  ],
  controllers: [],
  providers: [AppUpdate, PrismaService, CategoryService],
})
export class AppModule {}