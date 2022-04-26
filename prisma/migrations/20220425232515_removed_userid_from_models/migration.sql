/*
  Warnings:

  - You are about to drop the column `userId` on the `downvotes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `upvotes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "downvotes" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "upvotes" DROP COLUMN "userId";
