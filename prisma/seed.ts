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

  await prisma.patient.deleteMany({});

  const patients = [
    {
      name: "Rajesh Kumar",
      age: 45,
      bloodGroup: "O+",
      weight: 75.5,
      bloodPressure: "120/80",
      phone: "9876543210",
      status: "Pending",
      doctorId: 1,
      doctorName: "Dr. Smith",
      bookingDate: "2026-04-06",
      bookingTime: "10:00",
    },
    {
      name: "Priya Singh",
      age: 32,
      bloodGroup: "A+",
      weight: 62.0,
      bloodPressure: "118/76",
      phone: "9876543211",
      status: "Completed",
      doctorId: 2,
      doctorName: "Dr. Johnson",
      bookingDate: "2026-04-05",
      bookingTime: "14:30",
    },
    {
      name: "Amit Patel",
      age: 55,
      bloodGroup: "B+",
      weight: 82.3,
      bloodPressure: "125/82",
      phone: "9876543212",
      status: "Pending",
      doctorId: 1,
      doctorName: "Dr. Smith",
      bookingDate: "2026-04-07",
      bookingTime: "09:00",
    },
    {
      name: "Neha Gupta",
      age: 28,
      bloodGroup: "AB+",
      weight: 58.5,
      bloodPressure: "115/75",
      phone: "9876543213",
      status: "Pending",
      doctorId: 3,
      doctorName: "Dr. Williams",
      bookingDate: "2026-04-08",
      bookingTime: "11:00",
    },
    {
      name: "Vikram Sharma",
      age: 48,
      bloodGroup: "O-",
      weight: 78.0,
      bloodPressure: "122/81",
      phone: "9876543214",
      status: "Completed",
      doctorId: 2,
      doctorName: "Dr. Johnson",
      bookingDate: "2026-04-04",
      bookingTime: "15:00",
    },
  ];

  for (const patient of patients) {
    const created = await prisma.patient.create({
      data: patient,
    });
    console.log(`✅ Created patient: ${created.name}`);
  }

  console.log(`\n✅ Database seeded successfully with ${patients.length} patients!`);
}

main()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
