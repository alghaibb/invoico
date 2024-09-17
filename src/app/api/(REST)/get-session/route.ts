import { getSession } from "@/utils/session"; 

export async function GET() {
  const session = await getSession(); 

  return new Response(
    JSON.stringify({
      user: session?.user || null,
    }),
    { status: 200 }
  );
}
