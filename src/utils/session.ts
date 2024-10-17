import { cookies } from "next/headers";

import prisma from "@/lib/prisma";

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
      user: {
        include: {
          Plan: true,
        }
      },
    },
    cacheStrategy: {
      ttl: 60, // Cache session for 60 seconds
      swr: 120, // Serve stale data for 120 seconds
    }
  });

  return session;
}

// New function to get user details like the name from the session
export async function getUserFromSession() {
  const session = await getSession(); // Use the getSession function to get the session

  if (!session || !session.user) return null;

  const { user } = session;

  return {
    name: user.firstName + " " + user.lastName,
    email: user.email,
    planType: user.Plan?.type,
    planId: user.Plan?.id
  };
}