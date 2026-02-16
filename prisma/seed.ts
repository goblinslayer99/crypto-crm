import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const skills = [
  "Solana",
  "Rust",
  "EVM",
  "Solidity",
  "DeFi",
  "NFTs",
  "Smart Contracts",
  "Zero Knowledge",
  "MEV",
  "Trading",
  "Research",
  "Security",
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps",
  "Product",
  "Design",
  "Marketing",
  "Community",
  "Business Dev",
  "Investing",
  "Move",
  "Cairo",
  "CosmWasm",
  "Bitcoin",
  "Ethereum",
  "Layer 2",
  "Bridge",
  "Oracle",
  "DAO",
  "Gaming",
  "Infrastructure",
  "Data",
  "AI/ML",
];

async function main() {
  console.log("Connecting to:", process.env.TURSO_DATABASE_URL);

  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const prisma = new PrismaClient({ adapter });

  console.log("Seeding skills...");

  for (const skillName of skills) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    });
  }

  console.log(`Seeded ${skills.length} skills.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
