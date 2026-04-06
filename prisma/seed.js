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

    // Sample patients data
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
        bloodPressure: "135/85",
        phone: "9876543212",
        status: "Pending",
        doctorId: 1,
        doctorName: "Dr. Smith",
        bookingDate: "2026-04-07",
        bookingTime: "11:15",
      },
      {
        name: "Sneha Gupta",
        age: 28,
        bloodGroup: "AB+",
        weight: 58.7,
        bloodPressure: "115/75",
        phone: "9876543213",
        status: "Completed",
        doctorId: 3,
        doctorName: "Dr. Williams",
        bookingDate: "2026-04-04",
        bookingTime: "09:45",
      },
      {
        name: "Vikram Rao",
        age: 67,
        bloodGroup: "O-",
        weight: 78.9,
        bloodPressure: "140/90",
        phone: "9876543214",
        status: "Pending",
        doctorId: 2,
        doctorName: "Dr. Johnson",
        bookingDate: "2026-04-08",
        bookingTime: "16:00",
      },
    ];

    // Insert patients
    for (const patient of patients) {
      await prisma.patient.create({
        data: patient,
      });
    }

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Added ${patients.length} sample patients`);
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
