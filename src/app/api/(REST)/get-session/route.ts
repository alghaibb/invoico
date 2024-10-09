import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { getUserByIdWithPlan } from "@/utils/user/getUser";

export async function GET() {
  const session = await getSession();

  if (!session?.user?.email) {
    return new Response(
      JSON.stringify({ user: null }),
      { status: 200 }
    );
  }

  // Fetch the user along with their plan
  const userWithPlan = await getUserByIdWithPlan(session.user.id);

  return new Response(
    JSON.stringify({
      user: userWithPlan || null,
    }),
    { status: 200 }
  );
}
