/*
  Warnings:

  - You are about to drop the column `min_order_value` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `rating_average` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `total_orders` on the `restaurants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."restaurants" DROP COLUMN "min_order_value",
DROP COLUMN "rating_average",
DROP COLUMN "total_orders";
