const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Upsert the FREE plan (create if it doesn"t exist, otherwise do nothing)
  const freePlan = await prisma.plan.upsert({
    where: { type: "FREE" },   // Look for the existing FREE plan by type
    update: {},                // If the plan exists, do nothing
    create: {                  // If it doesn"t exist, create a new FREE plan
      type: "FREE",            // Enum type for the plan
      invoiceLimit: 10,        // Set the invoice limit for free plan users
    },
  });

  console.log("Free plan seeded:", freePlan);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
