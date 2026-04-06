-- CreateTable
CREATE TABLE "Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "doctorId" INTEGER,
    "doctorName" TEXT,
    "consultationStatus" TEXT,
    "token" INTEGER,
    "consultationStartedAt" TEXT,
    "bookingDate" TEXT,
    "bookingTime" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Patient_status_idx" ON "Patient"("status");

-- CreateIndex
CREATE INDEX "Patient_doctorId_idx" ON "Patient"("doctorId");
