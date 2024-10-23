import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Fetch the user along with their plan from Prisma
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        Plan: true, // Include the user's plan if necessary
      },
    });

    return NextResponse.json({ user: user || null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
