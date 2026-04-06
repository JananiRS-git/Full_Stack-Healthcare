import "dotenv/config";

let prisma: any;

if (process.env.NODE_ENV === "production") {
  prisma = new (require("@prisma/client").PrismaClient)({
    log: ["query"],
    adapter: new (require("@prisma/adapter-better-sqlite3").PrismaBetterSqlite3)({
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    }),
  });
} else {
  const globalForPrisma = global as any;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new (require("@prisma/client").PrismaClient)({
      log: ["query"],
      adapter: new (require("@prisma/adapter-better-sqlite3").PrismaBetterSqlite3)({
        url: process.env.DATABASE_URL ?? "file:./dev.db",
      }),
    });
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
