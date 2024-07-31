/*
  Warnings:

  - Added the required column `user_role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "user_role" "UserRole" NOT NULL;
