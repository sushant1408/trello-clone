import "dotenv/config";
import { PrismaClient } from "./generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Performing CRUD operations on Trello Clone DB...");

  // CREATE
  const newBoard = await prisma.board.create({
    data: {
      orgId: `test-org-${Date.now()}`,
      title: "Test Board",
      imageId: "test-image-id",
      imageThumbUrl: "https://images.unsplash.com/test-thumb",
      imageFullUrl: "https://images.unsplash.com/test-full",
      imageUserName: "Test User",
      imageLinkHtml: '<a href="https://unsplash.com">Unsplash</a>',
    },
  });
  console.log("✅ CREATE: New board created:", newBoard);

  // READ
  const foundBoard = await prisma.board.findUnique({
    where: { id: newBoard.id },
  });
  console.log("✅ READ: Found board:", foundBoard);

  // UPDATE
  const updatedBoard = await prisma.board.update({
    where: { id: newBoard.id },
    data: { title: "Updated Test Board" },
  });
  console.log("✅ UPDATE: Board updated:", updatedBoard);

  // DELETE
  await prisma.board.delete({ where: { id: newBoard.id } });
  console.log("✅ DELETE: Board deleted.");

  console.log("\n🎉 CRUD operations completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
