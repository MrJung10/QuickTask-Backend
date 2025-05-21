import { PrismaClient } from "@prisma/client";
import UserSeeder from "./UserSeeder.js";

const prisma = new PrismaClient();

async function DatabaseSeeder() {
  try {
    await Promise.all([UserSeeder()]);

    console.log("Seeder ran successfully!");
  } catch (err) {
    console.error("Error running seeders:", err);
  } finally {
    await prisma.$disconnect();
  }
}

DatabaseSeeder();
