import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  return NextResponse.json(contact);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { skills: skillNames, ...contactData } = body;

  // First, delete all existing skill associations
  await prisma.contactSkill.deleteMany({
    where: { contactId: id },
  });

  const contact = await prisma.contact.update({
    where: { id },
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

  return NextResponse.json(contact);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.contact.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
