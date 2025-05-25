import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma/client";
import { sendPasswordResetEmail } from "../utils/emailClient";

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
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // 尋找用戶
  const user = await prisma.user.findUnique({ where: { email: email } });
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
    birthday: Date | null;
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

// 編輯使用者大頭貼
export const uploadUserAvatar = async (userId: number, avatar: string) => {
  // 檢查用戶是否存在
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new Error("使用者不存在");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { avatar },
  });
};

// 發送重設密碼郵件
export const requestPasswordReset = async (email: string) => {
  // 檢查郵箱是否存在
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("未找到符合該電子郵件的使用者");
  }

  // 產生隨機令牌
  const resetToken = crypto.randomBytes(32).toString("hex");
  // 設定五分鐘過期
  const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

  // 保存令牌到用戶資料中
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // 發送重設密碼郵件
  const emailSent = await sendPasswordResetEmail(email, resetToken, 5);
  if (!emailSent) {
    throw new Error("發送重設密碼郵件失敗");
  }

  return true;
};

// 重設密碼
export const resetPassword = async (resetToken: string, newPassword: string) => {
  // 找到對應令牌的用戶
  const user = await prisma.user.findFirst({
    where: {
      resetToken,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("無效或過期的重設令牌");
  }

  // 雜湊新密碼
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // 更新密碼並清除令牌
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
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
      organization: true,
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

// 清理過期的重設密碼令牌
export const cleanExpiredResetTokens = async () => {
  const now = new Date();

  // 更新所有過期的令牌為 null
  await prisma.user.updateMany({
    where: {
      resetTokenExpiry: {
        lt: now,
      },
      resetToken: {
        not: null,
      },
    },
    data: {
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
};

// Google 使用者認證和處理
export const handleGoogleUser = async (googleUserData: {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}) => {
  // 檢查是否已有此 Google 帳號的用戶
  let user = await prisma.user.findFirst({
    where: {
      userIdentity: {
        some: {
          provider: "google",
          providerId: googleUserData.sub,
        },
      },
    },
  });

  let isNewUser = false;

  if (!user) {
    // 檢查是否有相同 email 的用戶
    user = await prisma.user.findUnique({
      where: { email: googleUserData.email },
    });

    if (user) {
      // 將 Google 身份連結到現有用戶
      await prisma.userIdentity.create({
        data: {
          userId: user.id,
          provider: "google",
          providerId: googleUserData.sub,
          email: googleUserData.email,
        },
      });
    } else {
      // 創建新用戶
      isNewUser = true;
      const hashedPassword = await bcrypt.hash(uuidv4(), 10);
      user = await prisma.user.create({
        data: {
          email: googleUserData.email,
          password: hashedPassword,
          name: googleUserData.name,
          avatar: googleUserData.picture,
          memberId: uuidv4(),
          userIdentity: {
            create: {
              provider: "google",
              providerId: googleUserData.sub,
              email: googleUserData.email,
            },
          },
        },
      });
    }
  }

  // 創建 JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token, isNewUser };
};
