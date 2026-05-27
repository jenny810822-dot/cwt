-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "edition" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "dateStart" TEXT NOT NULL,
    "dateEnd" TEXT NOT NULL,
    "timeStart" TEXT NOT NULL DEFAULT '10:30',
    "timeEnd" TEXT NOT NULL DEFAULT '16:30',
    "venue" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL DEFAULT '#e8789a',
    "heroImage" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("accentColor", "dateEnd", "dateStart", "edition", "heroImage", "id", "timeEnd", "timeStart", "updatedAt", "venue") SELECT "accentColor", "dateEnd", "dateStart", "edition", "heroImage", "id", "timeEnd", "timeStart", "updatedAt", "venue" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
