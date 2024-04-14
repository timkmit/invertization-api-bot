import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ImagesService],
})
export class ProductModule {}
