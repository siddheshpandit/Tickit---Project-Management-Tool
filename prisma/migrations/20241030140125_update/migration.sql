/*
  Warnings:

  - The values [PENDING,COMPLETED] on the enum `IssueStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IssueStatus_new" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');
ALTER TABLE "Issues" ALTER COLUMN "status" TYPE "IssueStatus_new" USING ("status"::text::"IssueStatus_new");
ALTER TYPE "IssueStatus" RENAME TO "IssueStatus_old";
ALTER TYPE "IssueStatus_new" RENAME TO "IssueStatus";
DROP TYPE "IssueStatus_old";
COMMIT;
