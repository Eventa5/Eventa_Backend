import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const activities = [
  {
    organizerId: 1,
    title: "活動TEST1",
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isOnline: false,
    categoryIds: [1, 2], // 自訂欄位，用來 connect
    location: "台北",
    cover: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
  },
  {
    organizerId: 1,
    title: "活動TEST2",
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isOnline: true,
    categoryIds: [3, 5],
    location: "高雄",
    cover: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
  },
];

export const seedActivities = async () => {
  // Check if activities are already seeded
  const existing = await prisma.activity.count();
  if (existing) return console.log("activities already seeded.");

  for (const activity of activities) {
    const { categoryIds, ...rest } = activity;
    await prisma.activity.create({
      data: {
        ...rest,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
    });
  }

  console.log("🌱 activities seeded successfully.");
};
