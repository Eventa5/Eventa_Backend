import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const presetCategories: Array<{ name: string; icon: string }> = [
  { name: "戶外體驗", icon: "tent-tree" },
  { name: "學習", icon: "book-open-text" },
  { name: "親子", icon: "baby" },
  { name: "寵物", icon: "paw-print" },
  { name: "科技", icon: "cpu" },
  { name: "商業", icon: "briefcase-business" },
  { name: "創業", icon: "rocket" },
  { name: "投資", icon: "chart-no-axes-combined" },
  { name: "設計", icon: "palette" },
  { name: "藝文", icon: "drama" },
  { name: "手作", icon: "scissors" },
  { name: "美食", icon: "hamburger" },
  { name: "攝影", icon: "camera" },
  { name: "遊戲", icon: "gamepad-2" },
  { name: "運動", icon: "dumbbell" },
  { name: "健康", icon: "heart-pulse" },
  { name: "音樂", icon: "music" },
  { name: "電影", icon: "clapperboard" },
  { name: "娛樂", icon: "party-popper" },
  { name: "區塊鏈", icon: "boxes" },
  { name: "時尚", icon: "shopping-bag" },
  { name: "公益", icon: "hand-heart" },
];

export const seedCategories = async () => {
  // Check if categories are already seeded
  const existing = await prisma.category.count();
  if (existing) return console.log("Categories already seeded.");

  const categories: Prisma.CategoryCreateManyInput[] = presetCategories.map((category) => ({
    name: category.name,
    image: faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
    icon: category.icon,
  }));

  await prisma.category.createMany({
    data: categories,
  });

  console.log("Categories seeded successfully.");
};
