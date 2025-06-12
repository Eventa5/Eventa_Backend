import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// Rate Limiter - 限制每個IP的請求頻率
export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10分鐘
  max: 25, // 每個IP每10分鐘最多25個請求
  message: {
    message: "OpenAI API 請求次數已達上限，請等待10分鐘後再試",
    status: false,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 慢速下降中間件 - 逐漸減慢響應速度而不是直接拒絕
export const speedLimiter = slowDown({
  windowMs: 2 * 60 * 1000, // 2分鐘
  delayAfter: 8, // 第8次請求後開始延遲
  delayMs: (hits) => (hits - 7) * 1000, // 第8次開始，每次增加1秒延遲
  maxDelayMs: 8000, // 最大延遲8秒
});

// 專門用於聊天API的組合限制器
export const chatRateLimiter = [speedLimiter, rateLimiter];
