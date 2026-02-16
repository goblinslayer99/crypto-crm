import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

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
  console.log("Seeding skills...");

  for (const skillName of skills) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName },
    });
  }

  console.log(`Seeded ${skills.length} skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
