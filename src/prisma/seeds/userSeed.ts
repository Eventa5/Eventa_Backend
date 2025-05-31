import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
// const user: Prisma.UserCreateInput = {
//   email: "user@gmail.com",
//   password: bcrypt.hashSync("user1234", bcrypt.genSaltSync(10)),
//   memberId: uuidv4(),
//   avatar: faker.image.avatar(),
// };

const users: Prisma.UserCreateManyInput[] = [
  {
    email: "user@gmail.com",
    password: bcrypt.hashSync("user1234", bcrypt.genSaltSync(10)),
    memberId: uuidv4(),
    avatar: faker.image.avatar(),
  },
  {
    email: "test@test.com",
    password: bcrypt.hashSync("test1234", bcrypt.genSaltSync(10)),
    memberId: uuidv4(),
    avatar: faker.image.avatar(),
    name: "王小明",
  },
];

export const seedUsers = async () => {
  // Check if users are already seeded
  const existing = await prisma.user.count();
  if (existing) return console.log("User already seeded.");

  await prisma.user.createMany({
    data: users,
  });

  // await prisma.user.upsert({
  //   where: { email: user.email },
  //   update: {},
  //   create: user,
  // });

  console.log("🌱 User seeded successfully.");
};
