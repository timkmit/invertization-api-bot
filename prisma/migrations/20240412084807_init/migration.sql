-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
