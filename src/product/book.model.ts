import { Prisma } from "@prisma/client";

export class Product implements Prisma.ProductCreateInput {
    id: number;
    name: string;
    count: number;
    price: number;
    color: string;
    category: string;
    visibility: boolean;
}