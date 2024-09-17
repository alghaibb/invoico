import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// Function to get session from Prisma using the session token
export async function getSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"
  );

  if (!sessionToken) return null;

  // Query session from the Prisma database
  const session = await prisma.session.findUnique({
    where: { sessionToken: sessionToken.value },
    include: {
      user: true,
    },
  });

  return session;
}