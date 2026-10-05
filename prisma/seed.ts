import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.service.createMany({
    data: [
      {
        name: "Gel Polish",
        description: "เจลสีพื้นสำหรับเล็บมือ",
        price: 0,
        duration: 60,
      },
      {
        name: "Nail Art",
        description: "ออกแบบลวดลายตามสไตล์ที่ต้องการ",
        price: 0,
        duration: 90,
      },
      {
        name: "Nail Extension",
        description: "ต่อเล็บและตกแต่งทรงเล็บ",
        price: 0,
        duration: 120,
      },
    ],
  });

  console.log("Services created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });