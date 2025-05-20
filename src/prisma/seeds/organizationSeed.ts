import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const organization: Prisma.OrganizationCreateInput = {
  user: {
    connect: { id: 1 },
  },
  email: "evneta@eventa.com",
  name: "EVENTA官方",
  cover: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
  avatar: faker.image.avatar(),
};

export const seedOrganizations = async () => {
  // Check if organizations are already seeded
  const existing = await prisma.organization.count();
  if (existing) return console.log("organization already seeded.");

  await prisma.organization.upsert({
    where: { email: organization.email },
    update: {},
    create: organization,
  });

  console.log("🌱 Organization seeded successfully.");
};
