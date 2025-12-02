import prisma from "../models/prismaClient.js";
export async function initializePostgres() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔌 PostgreSQL disconnected");
  process.exit(0);
});
