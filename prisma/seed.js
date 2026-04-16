require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    await prisma.patient.deleteMany();

    // Clear existing data only; no predefined patient records are seeded.
    await prisma.patient.deleteMany();

    console.log("✅ Database seeded successfully.");
    console.log("📊 Existing patient records were cleared and no sample patients were added.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
