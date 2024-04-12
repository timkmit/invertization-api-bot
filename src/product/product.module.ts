import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductServise } from "./product.service";
import { PrismaService } from "src/prisma.service";



@Module({
    controllers: [ProductController],
    providers: [ProductServise, PrismaService]
})
export class ProductModule{}
