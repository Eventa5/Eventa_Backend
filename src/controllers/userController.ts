import type { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { InputValidationError } from "../errors/InputValidationError";
import {
  forgetSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updateProfileSchema,
} from "../schemas/zod/user.schema";
import * as userService from "../services/userService";
import { sendGoogleLoginEmail } from "../utils/emailClient";
import { uploadToImgur } from "../utils/imgurClient";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL || "";

const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL);

// Google 使用者資訊介面
interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

// 使用者註冊
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const validatedData = validateInput(signupSchema, req.body);

      await userService.createUser({
        email: validatedData.email,
        password: validatedData.password,
      });
      sendResponse(res, 201, "註冊成功", true);
    } catch (error) {
      if (error instanceof InputValidationError) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 使用者登入
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const validatedData = validateInput(loginSchema, req.body);

      const { token } = await userService.authenticateUser({
        email: validatedData.email,
        password: validatedData.password,
      });
      sendResponse(res, 200, "登入成功", true, token);
    } catch (error) {
      if (error instanceof InputValidationError) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 獲取使用者資料
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    try {
      const userData = await userService.getUserProfile(userId);
      sendResponse(res, 200, "success", true, userData);
    } catch (error) {
      if (error instanceof InputValidationError) {
        sendResponse(res, 404, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 更新使用者資料
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    try {
      const validatedData = validateInput(updateProfileSchema, req.body);

      await userService.updateUserProfile(userId, validatedData);

      sendResponse(res, 200, "更新成功", true);
    } catch (error) {
      if (error instanceof InputValidationError) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 請求密碼重設
export const forget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const validatedData = validateInput(forgetSchema, req.body);

      await userService.requestPasswordReset(validatedData.email);
      sendResponse(res, 200, "發送成功", true);
    } catch (error) {
      if (error instanceof InputValidationError) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 確認密碼重設
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    try {
      const validatedData = validateInput(resetPasswordSchema, req.body);

      await userService.resetPassword(validatedData.resetToken, validatedData.newPassword);
      sendResponse(res, 200, "更新成功", true);
    } catch (error) {
      if (error instanceof InputValidationError) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Google 登入
export const googleLogin = (req: Request, res: Response): void => {
  // 生成Google OAuth 授權URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });

  // 重定向到 Google 登入頁面
  res.redirect(authUrl);
};

// Google 登入回調
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    const errorHtml = `
      <html>
      <script>
        window.opener.postMessage({ success: false, message: "授權失敗" }, "*");
        window.close();
      </script>
      </html>
    `;
    res.send(errorHtml);
    return;
  }

  try {
    // 交換 access token
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`,
    );
    const data = (await response.json()) as GoogleUserInfo;

    const { token, isNewUser } = await userService.handleGoogleUser({
      sub: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
    });

    // 如果是新使用者，發送歡迎郵件
    if (isNewUser) {
      await sendGoogleLoginEmail(data.email, data.name);
    }

    res.redirect(`${process.env.FRONT_REDIRECT_URL}?token=${token}`);
  } catch (error) {
    console.error("Google OAuth 錯誤:", error);

    res.redirect(`${process.env.FRONT_REDIRECT_URL}`);
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.user?.id;
  const avatar = req.file;
  if (!userId) {
    sendResponse(res, 401, "未授權", false);
    return;
  }
  if (!avatar) {
    sendResponse(res, 400, "未上傳檔案", false);
    return;
  }

  try {
    const imageUrl = await uploadToImgur(avatar.buffer, avatar.originalname);
    await userService.uploadUserAvatar(userId, imageUrl);

    // 清除buffer
    if (req.file) {
      (req.file.buffer as unknown as Buffer | null) = null;
    }

    sendResponse(res, 200, "上傳成功", true, imageUrl);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
