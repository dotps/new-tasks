-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Created', 'Process', 'Completed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "projectId" INTEGER NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "TaskStatus" NOT NULL DEFAULT 'CREATED',
    "assignedToUserId" INTEGER,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Добавляем начальные данные

-- User
INSERT INTO "User" ("id", "name", "email", "createdAt")
VALUES (1, 'First User', 'first@test.ru', '2025-05-15T17:41:48.682Z');

-- Project
INSERT INTO "Project" ("id", "title", "description", "userId", "createdAt")
VALUES (1, 'Заголовок проекта', 'Описание проекта', 1, '2025-05-15T12:42:46.414Z');

-- Task
INSERT INTO "Task" ("id", "title", "description", "projectId", "dueAt", "createdAt", "status", "assignedToUserId", "completedAt")
VALUES (
    1,
    'Первая задача - обновление',
    'Описание задачи - обновление',
    1,
    '2025-10-14T21:13:21.000Z',
    '2025-05-15T12:42:50.191Z',
    'COMPLETED',
    1,
    '2025-05-15T12:43:01.333Z'
);

-- Обновляем последовательности
SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"));
SELECT setval('"Project_id_seq"', (SELECT MAX(id) FROM "Project"));
SELECT setval('"Task_id_seq"', (SELECT MAX(id) FROM "Task")); 