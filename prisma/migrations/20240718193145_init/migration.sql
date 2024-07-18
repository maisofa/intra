/*
  Warnings:

  - Changed the type of `status` on the `task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('ACCEPTED', 'REJEITED', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "task" DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL;
