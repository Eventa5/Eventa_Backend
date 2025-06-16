import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const presetCategories: Array<{ name: string; icon: string; image?: string }> = [
  {
    name: "戶外體驗",
    icon: "tent-tree",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750056013/categories/outdoor.jpg",
  },
  {
    name: "學習",
    icon: "book-open-text",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750059584/categories/learn.jpg",
  },
  {
    name: "親子",
    icon: "baby",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750054214/categories/family.jpg",
  },
  {
    name: "寵物",
    icon: "paw-print",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750053245/categories/krista-mangulsone-9gz3wfHr65U-unsplash.jpg",
  },
  {
    name: "科技",
    icon: "cpu",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750058347/categories/technology.jpg",
  },
  {
    name: "商業",
    icon: "briefcase-business",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750056770/categories/business.jpg",
  },
  {
    name: "創業",
    icon: "rocket",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750059241/categories/Entrepreneurship.jpg",
  },
  {
    name: "投資",
    icon: "chart-no-axes-combined",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750057677/categories/Investment.jpg",
  },
  {
    name: "設計",
    icon: "palette",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750053958/categories/design.jpg",
  },
  {
    name: "藝文",
    icon: "drama",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750057055/categories/art.jpg",
  },
  {
    name: "手作",
    icon: "scissors",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750054622/categories/diy.jpg",
  },
  {
    name: "美食",
    icon: "hamburger",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750055845/categories/food.jpg",
  },
  {
    name: "攝影",
    icon: "camera",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750054925/categories/Photography.jpg",
  },
  {
    name: "遊戲",
    icon: "gamepad-2",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750057857/categories/Gaming.jpg",
  },
  {
    name: "運動",
    icon: "dumbbell",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750055180/categories/sports.jpg",
  },
  {
    name: "健康",
    icon: "heart-pulse",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750057554/categories/Health.jpg",
  },
  {
    name: "音樂",
    icon: "music",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750055340/categories/music.jpg",
  },
  {
    name: "電影",
    icon: "clapperboard",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750053852/categories/marius-gire-VuN3x0cKC4I-unsplash%20%281%29.jpg",
  },
  {
    name: "娛樂",
    icon: "party-popper",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750058526/categories/entertainment.jpg",
  },
  {
    name: "區塊鏈",
    icon: "boxes",
    image:
      "https://res.cloudinary.com/djcf5ifah/image/upload/v1750058782/categories/Blockchain-1.jpg",
  },
  {
    name: "時尚",
    icon: "shopping-bag",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750057352/categories/fashion.jpg",
  },
  {
    name: "公益",
    icon: "hand-heart",
    image: "https://res.cloudinary.com/djcf5ifah/image/upload/v1750054818/categories/Charity.jpg",
  },
];

export const seedCategories = async () => {
  // Check if categories are already seeded
  const existing = await prisma.category.count();
  if (existing) return console.log("Categories already seeded.");

  const categories: Prisma.CategoryCreateManyInput[] = presetCategories.map((category) => ({
    name: category.name,
    image: category.image || faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
    icon: category.icon,
  }));

  await prisma.category.createMany({
    data: categories,
  });

  console.log("🌱 Categories seeded successfully.");
};
