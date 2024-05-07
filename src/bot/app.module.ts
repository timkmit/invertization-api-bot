import { Delete, Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { ProductModule } from '../product/product.module';
import { PrismaService } from 'src/prisma.service';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ImagesModule } from 'src/images/images.module';
import { RandomNumberScene } from './scenes/greeting.scene';
import { AddProductScene } from './scenes/add.scene';
import { EditProductScene } from './scenes/edit.scene';
import { DeleteProductScene } from './scenes/delete.scene';
import { InfoProductScene } from './scenes/info.scene';

const sessions = new LocalSession({ database: 'session_db.json' });
//TODO add .env
@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TG_BOT_TOKEN,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    
    ImagesModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [
    AppUpdate, 
    PrismaService, 
    CategoryService, 
    RandomNumberScene,
    AddProductScene,
    EditProductScene,
    DeleteProductScene,
    InfoProductScene],
})
export class AppModule {}
