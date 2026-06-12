import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.admin.upsert({
    where: { email: "admin@gameprice.com" },
    update: {},
    create: {
      email: "admin@gameprice.com",
      password: "admin123",
      name: "Admin",
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });