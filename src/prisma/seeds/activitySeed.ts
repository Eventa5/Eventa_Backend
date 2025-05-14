import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const activities: Prisma.ActivityCreateManyInput[] = [
  {
    organizerId: 1,
    title: "活動TEST1",
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isOnline: false,
  },
  {
    organizerId: 1,
    title: "活動TEST2",
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isOnline: true,
  },
];

export const seedActivities = async () => {
  // Check if activities are already seeded
  const existing = await prisma.activity.count();
  if (existing) return console.log("activities already seeded.");

  await prisma.activity.createMany({
    data: activities,
  });

  console.log("🌱 activities seeded successfully.");
};
