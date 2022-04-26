/*
  Warnings:

  - You are about to drop the `downvotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `upvotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "downvotes";

-- DropTable
DROP TABLE "upvotes";

-- CreateTable
CREATE TABLE "Upvotes" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Upvotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Downvotes" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Downvotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Upvotes" ADD CONSTRAINT "Upvotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downvotes" ADD CONSTRAINT "Downvotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
