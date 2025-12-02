import prisma from "../models/prismaClient.js";
import bcrypt from "bcryptjs";

async function main() {
  const password = "Admin@123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: "tisa@spericorn.com" },
    update: {},
    create: {
      firstname: "admin",
      lastname: "spericorn",
      email: "tisa@spericorn.com",
      password: hashedPassword,
      role: "Admin",
      status: "active",
      twoFASecret: "null",
      istwoFAEnabled: false,
    },
  });

  console.log("User seeded:", user);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
