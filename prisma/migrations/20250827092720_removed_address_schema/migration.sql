/*
  Warnings:

  - You are about to drop the column `delivery_address_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `address_book` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."address_book" DROP CONSTRAINT "address_book_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_delivery_address_id_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "delivery_address_id";

-- DropTable
DROP TABLE "public"."address_book";
