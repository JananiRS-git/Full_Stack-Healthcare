import "dotenv/config";
import * as PrismaClientPackage from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const { PrismaClient } = PrismaClientPackage as any;

const prisma = new PrismaClient({
  log: ["query"],
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.patient.deleteMany();
  console.log('✅ Cleared existing patients. No predefined patient records are seeded.');
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
