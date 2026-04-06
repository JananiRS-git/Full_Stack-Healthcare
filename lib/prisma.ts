import "dotenv/config";

let prisma: any;
const PrismaClient = require("@prisma/client").PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
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
