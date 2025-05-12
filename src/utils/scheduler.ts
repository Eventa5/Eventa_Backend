import { cleanExpiredResetTokens } from "../services/userService";

// 定時清理過期的重設密碼令牌
export const setupTokenCleanupTask = (): void => {
  const CLEANUP_INTERVAL = 1000 * 60 * 60; // 每小時執行一次

  // 立即清理一次
  cleanExpiredResetTokens().catch((err) => {
    console.error("清理過期令牌失敗:", err);
  });

  // 設置定時任務
  setInterval(() => {
    cleanExpiredResetTokens().catch((err) => {
      console.error("清理過期令牌失敗:", err);
    });
  }, CLEANUP_INTERVAL);

  console.log("已設置定期清理過期重設密碼令牌的任務");
};
