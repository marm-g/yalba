/*
  Warnings:

  - The primary key for the `Champion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Champion` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Champion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Champion" ("id", "name") SELECT "id", "name" FROM "Champion";
DROP TABLE "Champion";
ALTER TABLE "new_Champion" RENAME TO "Champion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
