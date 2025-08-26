/*
  Warnings:

  - Added the required column `description` to the `daily_meals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."daily_meals" ADD COLUMN     "description" TEXT NOT NULL;
