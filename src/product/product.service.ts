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
    return this.prisma.product.findUnique({
      where: { id: Number(id), visibility: true },
      include: { category: true },
    });
  }

  async getColors(category_ids: number[]) {
    const products = await this.prisma.product.findMany({
      where: { category_id: { in: category_ids }, visibility: true },
      include: { category: true },
    });

    return new Set(products.map((product) => product.color));
  }

  async getProductByDetails(
    category_ids?: string,
    colors?: string,
    year?: string,
    price?: string,
    count?: string,
  ) {
    const yearsData: { gte: number; lte: number } = {
      lte: year ? +year?.split('_')[1] : undefined,
      gte: year ? +year?.split('_')[0] : undefined,
    };

    const priceData: { gte: number; lte: number } = {
      lte: price ? +price?.split('_')[1] : undefined,
      gte: price ? +price?.split('_')[0] : undefined,
    };

    const countData: { gte: number; lte: number } = {
      lte: count ? +count?.split('_')[1] : undefined,
      gte: count ? +count?.split('_')[0] : undefined,
    };

    const idsData = category_ids ? JSON.parse(category_ids || '[]') : undefined;

    const colorsData = colors ? JSON.parse(colors || '[]') : undefined;

    return this.prisma.product.findMany({
      where: {
        category_id: { in: idsData },
        color: { in: colorsData },
        count: countData,
        price: priceData,
        year: yearsData,
        visibility: true,
      },
      include: { category: true },
    });
  }

  getByNameId(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [{ id: { equals: isNaN(Number(query)) ? 0 : Number(query) } }, { name: { contains: query } }],
      },
    });
  }

  async createProduct(
    product: CreateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<Product> {
    const fileNames = this.imagesService.loadManyImages(files);
    const productToSave: CreateProductDto & { images: string[] } = {
      ...product,
      images: fileNames,
    };
    
    return this.prisma.product.create({
      data: {
        color: productToSave.color,
        count: Number(productToSave.count),
        name: productToSave.name,
        price: Number(productToSave.price),
        visibility: productToSave.visibility === 'true',
        images: fileNames,
        year: Number(productToSave.year),
        category: { connect: { id: Number(productToSave.category_id) } },
      },
    });
  }

  async updateProduct(id: number, data: Product): Promise<Product> {
    return this.prisma.product.update({
      where: { id: Number(id) },
      data: data,
    });
  }

  async deleteProduct(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    this.imagesService.deleteManyImages(product.images);
    return this.prisma.product.delete({
      where: { id: product.id },
    });
  }

  async generateRandomDB(generationNumber: number) {
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < generationNumber; i++) {
      await this.prisma.product.create({
        data: {
          color: `Color ${getRandomInt(1, 4)}`,
          count: getRandomInt(0, 100),
          name: `Name ${i}`,
          price: 10 * getRandomInt(1, 100),
          visibility: true,
          year: getRandomInt(2000, 2024),
          category_id: getRandomInt(1, 4),
          images: ['generated.png'],
        },
      });
    }
  }
}
