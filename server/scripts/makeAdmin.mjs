import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ datasourceUrl: 'file:./dev.db' });

const email = process.argv[2];
if (!email) {
  console.error("Uso: node server/scripts/makeAdmin.mjs email@example.com");
  process.exit(1);
}

const user = await prisma.user.update({
  where: { email },
  data: { role: "ADMIN" }
}).catch(() => null);

if (!user) {
  console.error("Utente non trovato:", email);
  process.exit(1);
}

console.log("✅ Promosso ADMIN:", user.email);
await prisma.$disconnect();