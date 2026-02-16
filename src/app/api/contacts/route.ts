import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const skills = searchParams.get("skills")?.split(",").filter(Boolean) || [];

  const contacts = await prisma.contact.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { company: { contains: search } },
                { notes: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {},
        skills.length > 0
          ? {
              skills: {
                some: {
                  skill: {
                    name: { in: skills },
                  },
                },
              },
            }
          : {},
      ],
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { skills: skillNames, ...contactData } = body;

  const contact = await prisma.contact.create({
    data: {
      ...contactData,
      dateMet: new Date(contactData.dateMet),
      lastContacted: contactData.lastContacted
        ? new Date(contactData.lastContacted)
        : null,
      followUpDate: contactData.followUpDate
        ? new Date(contactData.followUpDate)
        : null,
      skills: {
        create: skillNames?.map((skillName: string) => ({
          skill: {
            connectOrCreate: {
              where: { name: skillName },
              create: { name: skillName },
            },
          },
        })) || [],
      },
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
