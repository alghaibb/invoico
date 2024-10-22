import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
  // Create Prisma client and extend it with Accelerate
  return new PrismaClient().$extends(withAccelerate());
};

// Ensure Prisma client singleton pattern to avoid multiple instances
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use global Prisma instance to prevent hot reload issues in development
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// If not in production, assign Prisma client to the global object
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
