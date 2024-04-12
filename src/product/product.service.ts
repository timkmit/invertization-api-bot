import { Product } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductServise{

    constructor(private prisma: PrismaService){}

    async getAllProducts(): Promise<Product[]>{
        return this.prisma.product.findMany()
    }

    async getProduct(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({where: {id: Number(id)}})
    }

    async createProduct(data: Product): Promise<Product>{
        return this.prisma.product.create({
            data,
        })
    }

    async updateProduct(id: number, data: Product): Promise<Product>{
        return this.prisma.product.update({
            where: {id:Number(id)},
            data: {
                name: data.name,
                count: data.count,
                price: data.price,
                color: data.color,
                category: data.category,
                visibility: data.visibility
            }
        })
    }

    async deleteProduct(id:number): Promise<Product>{
        return this.prisma.product.delete({
            where:{id: Number(id)}
        })
    }
}