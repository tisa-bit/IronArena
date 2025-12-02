/*
  Warnings:

  - You are about to drop the column `inviteToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `inviteTokenExpire` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "inviteToken",
DROP COLUMN "inviteTokenExpire",
ADD COLUMN     "istwoFAEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFASecret" TEXT NOT NULL DEFAULT 'null';
