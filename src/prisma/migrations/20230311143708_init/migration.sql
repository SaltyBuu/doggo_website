/*
  Warnings:

  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `playlistId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pkey",
DROP COLUMN "createdAt",
ADD COLUMN     "playlistId" INTEGER NOT NULL,
ADD COLUMN     "voteDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Vote_pkey" PRIMARY KEY ("songId", "playlistId", "userId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
