/*
  Warnings:

  - You are about to drop the column `fname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lname` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "fname",
DROP COLUMN "lname",
ADD COLUMN     "name" TEXT NOT NULL;
