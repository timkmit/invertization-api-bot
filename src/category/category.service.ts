import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.category.findMany({include: {Product: true}});
  }

  async getById(ids: number[]) {
    return await this.prisma.category.findMany({ where: { id: { in: ids } } });
  }

  async create(name: string) {
    return await this.prisma.category.create({ data: { name } });
  }

  async getByName(nameCategory: string){
    return await this.prisma.category.findFirst({where: {name: nameCategory}})
  }
}
