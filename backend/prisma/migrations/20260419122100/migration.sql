/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `chunk` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `document` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "document" ADD COLUMN     "account_id" TEXT;

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_id_key" ON "account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_key_key" ON "account"("key");

-- CreateIndex
CREATE UNIQUE INDEX "chunk_id_key" ON "chunk"("id");

-- CreateIndex
CREATE UNIQUE INDEX "document_id_key" ON "document"("id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
