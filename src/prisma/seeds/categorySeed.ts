import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();
const presetCategories: Array<{ name: string; icon: string }> = [
  { name: "戶外體驗", icon: "🏞️" },
  { name: "學習", icon: "📚" },
  { name: "親子", icon: "👨‍👩‍👧‍👦" },
  { name: "寵物", icon: "🐾" },
  { name: "科技", icon: "💻" },
  { name: "商業", icon: "💼" },
  { name: "創業", icon: "🚀" },
  { name: "投資", icon: "📈" },
  { name: "設計", icon: "🎨" },
  { name: "藝文", icon: "🖼️" },
  { name: "手作", icon: "🧶" },
  { name: "美食", icon: "🍽️" },
  { name: "攝影", icon: "📷" },
  { name: "遊戲", icon: "🎮" },
  { name: "運動", icon: "🏃" },
  { name: "健康", icon: "🧘" },
  { name: "音樂", icon: "🎵" },
  { name: "電影", icon: "🎬" },
  { name: "娛樂", icon: "🎭" },
  { name: "區塊鏈", icon: "🔗" },
  { name: "時尚", icon: "👗" },
  { name: "公益", icon: "🤝" },
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
