import { Product } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { ImagesService } from '../images/images.service';
import { CreateProductDto } from './dto/CreateProductDto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({ where: { visibility: true } });
  }

  async getProduct(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id: Number(id) } });
  }

  async createProduct(product: CreateProductDto, files: Array<Express.Multer.File>): Promise<Product> {
    const fileNames = this.imagesService.loadManyImages(files)
    const productToSave: CreateProductDto & {images: string[]} = {...product, images: fileNames}
    // как по мне решение днищенское, но работает - значит, не трогаем
    return this.prisma.product.create({
      data: {
        color: productToSave.color,
        count: Number(productToSave.count),
        name: productToSave.name,
        price: Number(productToSave.price),
        visibility: productToSave.visibility === 'true',
        category_id: Number(productToSave.category_id),
        images: fileNames
      },
    });
  }

  async updateProduct(id: number, data: Product): Promise<Product> {
    return this.prisma.product.update({
      where: { id: Number(id) },
      data,
    });
  }

  async deleteProduct(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    this.imagesService.deleteManyImages(product.images);
    return this.prisma.product.delete({
      where: { id: product.id },
    });
  }
}
