/*
  Warnings:

  - The `state` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentQuestion" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "state",
ADD COLUMN     "state" JSONB;
