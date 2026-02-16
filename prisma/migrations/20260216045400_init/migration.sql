-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "telegram" TEXT,
    "twitter" TEXT,
    "discord" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "email" TEXT,
    "company" TEXT,
    "role" TEXT,
    "currentProject" TEXT,
    "howWeMet" TEXT,
    "dateMet" DATETIME NOT NULL,
    "lastContacted" DATETIME,
    "followUpDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ContactSkill" (
    "contactId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    PRIMARY KEY ("contactId", "skillId"),
    CONSTRAINT "ContactSkill_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContactSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");
