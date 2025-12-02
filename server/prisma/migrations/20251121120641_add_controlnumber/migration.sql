/*
  Warnings:

  - Added the required column `controlnumber` to the `Control` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Control" ADD COLUMN     "controlnumber" INTEGER NOT NULL;
