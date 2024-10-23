import prisma from "@/lib/prisma";

export async function getRecentInvoices(userId: string, limit: number) {
  return await prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
