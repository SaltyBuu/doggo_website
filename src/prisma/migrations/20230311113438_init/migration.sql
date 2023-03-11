/*
  Warnings:

  - You are about to drop the column `submitterId` on the `PlaylistSong` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `submitter` to the `PlaylistSong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_submitterId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- DropIndex
DROP INDEX "User_login_key";

-- AlterTable
ALTER TABLE "PlaylistSong" DROP COLUMN "submitterId",
ADD COLUMN     "submitter" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("login");

-- AlterTable
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pkey",
DROP COLUMN "userId",
ADD COLUMN     "user" TEXT NOT NULL,
ADD CONSTRAINT "Vote_pkey" PRIMARY KEY ("songId", "user");

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_submitter_fkey" FOREIGN KEY ("submitter") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
