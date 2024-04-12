import { Product } from "@prisma/client";
import { ProductServise } from "./product.service";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

@Controller('api/product')
export class ProductController{

    constructor(private readonly productServise: ProductServise){}

    @Get()
    async getAllProducts():Promise<Product[]>{
        return this.productServise.getAllProducts()
    }

    @Post()
    async postProduct(@Body() postData: Product): Promise<Product>{
        return this.productServise.createProduct(postData)
    }

    @Get(':id')
    async getProduct(@Param('id') id: number): Promise<Product | null>{
        return this.productServise.getProduct(id)
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: number): Promise<Product>{
        return this.productServise.deleteProduct(id)
    }

    @Put(':id')
    async updateProduct(@Param('id') id: number, @Body() postData: Product): Promise<Product>{
        return this.productServise.updateProduct(id, postData)
    }
}