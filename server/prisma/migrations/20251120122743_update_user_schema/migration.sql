-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inviteToken" TEXT,
ADD COLUMN     "inviteTokenExpire" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'invited',
ALTER COLUMN "password" DROP NOT NULL;
