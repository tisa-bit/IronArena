/*
  Warnings:

  - Added the required column `controlmapping` to the `Control` table without a default value. This is not possible if the table is not empty.
  - Made the column `tips` on table `Control` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mediaLink` on table `Control` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Control" ADD COLUMN     "controlmapping" TEXT NOT NULL,
ALTER COLUMN "tips" SET NOT NULL,
ALTER COLUMN "mediaLink" SET NOT NULL;
