-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('CREATED', 'PROCESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'CREATED';
