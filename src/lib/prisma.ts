import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Prisma client factory function with Accelerate extension
const prismaClientSingleton = () => {
  // Initialize Neon pool
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });

  // Setup Neon adapter for Prisma
  const adapter = new PrismaNeon(neon);

  // Create Prisma client and extend it with Accelerate
  return new PrismaClient({ adapter }).$extends(withAccelerate());
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
