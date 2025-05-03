import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 使用者註冊服務
export const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // 檢查郵箱是否已存在
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("該郵箱已被註冊");
  }

  // 加密密碼
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 創建用戶
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      memberId: uuidv4(),
    },
  });
};

// 使用者登入服務
export const authenticateUser = async ({
  account,
  password,
}: {
  account: string;
  password: string;
}) => {
  // 尋找用戶
  const user = await prisma.user.findUnique({ where: { email: account } });
  if (!user || !user.password) {
    throw new Error("帳號或密碼錯誤");
  }

  // 驗證密碼
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("帳號或密碼錯誤");
  }

  // 生成 JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
};

// 獲取使用者資料
export const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("使用者不存在");
  }

  // 格式化生日
  const formattedBirthday = user.birthday
    ? new Date(user.birthday).toISOString().split("T")[0].replace(/-/g, "/")
    : null;

  return {
    id: user.id.toString(),
    memberId: user.memberId,
    name: user.name || null,
    email: user.email,
    avatar: user.avatar || null,
    displayName: user.displayName || null,
    birthday: formattedBirthday,
    gender: user.gender || null,
    phoneNumber: user.phoneNumber || null,
    countryCode: user.countryCode || null,
    region: user.region || null,
    address: user.address || null,
    identity: user.identity || null,
  };
};

// 更新使用者資料
export const updateUserProfile = async (
  userId: number,
  {
    name,
    email,
    avatar,
    displayName,
    birthday,
    gender,
    phoneNumber,
    countryCode,
    region,
    address,
    identity,
  }: {
    name: string | null;
    email: string;
    avatar: string | null;
    displayName: string | null;
    birthday: string | null;
    gender: string | null;
    phoneNumber: string | null;
    countryCode: string | null;
    region: string | null;
    address: string | null;
    identity: string | null;
  },
) => {
  // 檢查用戶是否存在
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new Error("使用者不存在");
  }

  // 檢查電子郵件
  if (email && email !== existingUser.email) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    });
    if (emailExists) throw new Error("此電子郵件已被使用");
  }

  // 更新用戶資料
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      avatar,
      displayName,
      birthday,
      gender,
      phoneNumber,
      countryCode,
      region,
      address,
      identity,
    },
  });
};

// 獲取所有使用者
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      memberId: true,
      email: true,
      name: true,
      avatar: true,
      displayName: true,
      createdAt: true,
    },
  });
};

// 依ID獲取使用者
export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      organizer: true,
    },
  });

  if (!user) {
    throw new Error("使用者不存在");
  }

  return user;
};

// 刪除使用者
export const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("使用者不存在");
  }

  return await prisma.user.delete({ where: { id } });
};
