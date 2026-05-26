-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "edition" INTEGER NOT NULL,
    "dateStart" TEXT NOT NULL,
    "dateEnd" TEXT NOT NULL,
    "timeStart" TEXT NOT NULL DEFAULT '10:30',
    "timeEnd" TEXT NOT NULL DEFAULT '16:30',
    "venue" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL DEFAULT '#e8789a',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT,
    "tagColor" TEXT,
    "link" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuickEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL DEFAULT '#f0d8e4',
    "dark" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SiteWidget" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "countdownDate" TEXT NOT NULL DEFAULT '2025-12-27T10:30:00+08:00',
    "themeSongTitle" TEXT NOT NULL DEFAULT 'CWT 主題曲'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
