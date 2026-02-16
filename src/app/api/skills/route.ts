import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const skills = await prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(skills);
}
