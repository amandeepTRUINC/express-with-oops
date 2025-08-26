/*
  Warnings:

  - Added the required column `restaurant_id` to the `daily_meals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."daily_meals" ADD COLUMN     "restaurant_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."floors" ADD COLUMN     "company_name" TEXT;

-- AddForeignKey
ALTER TABLE "public"."daily_meals" ADD CONSTRAINT "daily_meals_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
