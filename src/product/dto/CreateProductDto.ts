import { Product } from "@prisma/client";

export interface CreateProductDto extends Omit<Product, 'id' | 'images' | 'visibility'> {
    visibility: string
}