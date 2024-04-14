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
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/CreateProductDto';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get('/search')
  async getProductByDetails(
    @Query('categories') category_ids: string,
    @Query('colors') colors: string,
    @Query('years') years: string,
    @Query('price') price: string,
    @Query('count') count: string,
  ) {
    return await this.productService.getProductByDetails(
      category_ids,
      colors,
      years,
      price,
      count,
    );
  }

  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product | null> {
    return this.productService.getProduct(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async postProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() postData: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(postData, files);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.deleteProduct(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() postData: Product,
  ): Promise<Product> {
    return this.productService.updateProduct(id, postData);
  }

  @Get('/generate/:num')
  async generateRandomDB(@Param('num') num: string) {
    const generateNum = Number(num);
    return await this.productService.generateRandomDB(generateNum);
  }
}
