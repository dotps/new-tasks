-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('CREATED', 'PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'CREATED';
