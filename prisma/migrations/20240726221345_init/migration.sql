/*
  Warnings:

  - You are about to drop the column `user_id` on the `task` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `task` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `priority` on the `task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_user_id_fkey";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "user_id",
ADD COLUMN     "recipientId" TEXT,
ADD COLUMN     "senderId" TEXT NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" "TaskPriority" NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
