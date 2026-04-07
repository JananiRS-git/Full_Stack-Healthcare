import "dotenv/config";

let prisma: any;
const PrismaClient = require("@prisma/client").PrismaClient;

if (process.env.NODE_ENV === "production") {
  const { PrismaPg } = require("@prisma/adapter-pg");
  const { Pool } = require("pg");

  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
    log: ["query"],
  });
} else {
  const globalForPrisma = global as any;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["query"],
    });
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
