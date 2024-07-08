-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT
);

-- CreateTable
CREATE TABLE "Organisation" (
    "orgId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "_OrgUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_OrgUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Organisation" ("orgId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrgUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrgUsers_AB_unique" ON "_OrgUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_OrgUsers_B_index" ON "_OrgUsers"("B");
