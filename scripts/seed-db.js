#!/usr/bin/env node

const path = require("path");
require("dotenv/config");

// Manually set up Prisma client since seed might have issues
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const prisma = new PrismaClient({
  log: ["query"],
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    await prisma.patient.deleteMany({});
    console.log("✅ Cleared existing patients");

    // Clear existing patient data only; no predefined patient records are seeded.
    await prisma.patient.deleteMany();
    console.log("✅ Cleared existing patients.");
    console.log("📊 No sample patients were added.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
