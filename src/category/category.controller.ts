import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories () {
    return await this.categoryService.getAll()
  }

  @Post() 
  async createCategory (@Body() body: {name: string}) {
    return await this.categoryService.create(body.name)
  } 
}
