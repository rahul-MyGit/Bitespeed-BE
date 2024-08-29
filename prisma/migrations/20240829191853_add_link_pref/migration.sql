/*
  Warnings:

  - Changed the type of `linkPrecedence` on the `Contact` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LinkPrecedence" AS ENUM ('PRIMARY', 'SECONDARY');

-- DropIndex
DROP INDEX "Contact_email_idx";

-- DropIndex
DROP INDEX "Contact_linkedId_idx";

-- DropIndex
DROP INDEX "Contact_phoneNumber_idx";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "linkPrecedence",
ADD COLUMN     "linkPrecedence" "LinkPrecedence" NOT NULL;
