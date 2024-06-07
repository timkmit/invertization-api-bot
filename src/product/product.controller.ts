import { Product } from '@prisma/client';
import { ProductService } from './product.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/CreateProductDto';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get('/get/:id')
  async getProduct(@Param('id') id: number): Promise<Product | null> {
    return this.productService.getProduct(id);
  }

  @Get('/search')
  async getProductByDetails(
    @Query('categories') category_ids: string,
    @Query('colors') colors: string,
    @Query('years') years: string,
    @Query('price') price: string,
    @Query('count') count: string,
  ) {
    return await this.productService.getProductByDetails(category_ids, colors, years, price, count);
  }

  @Get('/nameid')
  getProductByNameId(@Query('query') query: string, @Query('page') page: string, @Query('take') take: string) {
    return this.productService.getByNameId(query, Number(take), Number(page));
  }

  @Get('/color')
  async getColors(@Query('categories') categories: string) {
    const category_ids: number[] = JSON.parse(categories);
    return { colors: Array.from(await this.productService.getColors(category_ids)) };
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async postProduct(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() postData: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(postData, files);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.deleteProduct(id);
  }

  @Put('/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async updateProduct(
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() postData: Product & { is_images_changed: string },
  ): Promise<Product> {
    return this.productService.updateProduct(id, postData, files);
  }

  @Get('/generate/:num')
  async generateRandomDB(@Param('num') num: string) {
    const generateNum = Number(num);
    return await this.productService.generateRandomDB(generateNum);
  }
}
