import { Product } from '@prisma/client';
import { ProductService } from './product.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/CreateProductDto';

@Controller('api/product')
export class ProductController {
  constructor(
    private readonly productServise: ProductService,
  ) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productServise.getAllProducts();
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async postProduct(@UploadedFiles() files: Array<Express.Multer.File>, @Body() postData: CreateProductDto): Promise<Product> {
    console.log('Rofl')
    console.log(postData, files)
    return this.productServise.createProduct(postData, files);
  }

  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product | null> {
    return this.productServise.getProduct(id);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<Product> {
    return this.productServise.deleteProduct(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() postData: Product,
  ): Promise<Product> {
    return this.productServise.updateProduct(id, postData);
  }
}
