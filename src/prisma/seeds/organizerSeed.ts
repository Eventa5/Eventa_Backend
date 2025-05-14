import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const organizer: Prisma.OrganizerCreateInput = {
  user: {
    connect: { id: 1 },
  },
  email: "evneta@eventa.com",
  name: "EVENTA官方",
};

export const seedOrganizers = async () => {
  // Check if organizers are already seeded
  const existing = await prisma.organizer.count();
  if (existing) return console.log("organizer already seeded.");

  await prisma.organizer.upsert({
    where: { email: organizer.email },
    update: {},
    create: organizer,
  });

  console.log("🌱 Organizer seeded successfully.");
};
