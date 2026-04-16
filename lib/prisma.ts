import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: false });

const PrismaClient = require("@prisma/client").PrismaClient;
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const sqliteAdapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

let prisma: any;
const globalForPrisma = global as any;
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    adapter: sqliteAdapter,
    log: ["query"],
  });
}
prisma = globalForPrisma.prisma;

export { prisma };
