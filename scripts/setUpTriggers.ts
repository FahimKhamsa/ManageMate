// scripts/setupTriggers.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Drop if it already exists (to avoid dup errors)
  await prisma.$executeRaw`DROP TRIGGER IF EXISTS trg_after_event_insert;`;

  // Create the trigger
  await prisma.$executeRaw`
    CREATE TRIGGER trg_after_event_insert
    AFTER INSERT ON events
    FOR EACH ROW
    BEGIN
      INSERT INTO analytics (
        eventId,
        userId,
        totalTickets,
        totalSales,
        earlyBirdSales,
        regularSales,
        vipSales
      ) VALUES (
        NEW.id,
        NEW.organizerId,
        0,
        0,
        0,
        0,
        0
      );
    END;
  `;
  console.log("Trigger installed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
