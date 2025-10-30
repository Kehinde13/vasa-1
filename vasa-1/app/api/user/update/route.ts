import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      businessName: data.businessName,
      phone: data.phone,
      timeZone: data.timeZone,
      businessType: data.businessType,
      services: data.services.split(",").map((s: string) => s.trim()),
    },
  });

  return NextResponse.json(updatedUser);
}
