import cron from "node-cron";
import { updateExpiredActivities } from "../services/activityService";
import { cancelExpiredOrders } from "../services/orderService";
import { updateExpiredTicket } from "../services/ticketService";
import { cleanExpiredResetTokens } from "../services/userService";

// // 定時清理過期的重設密碼令牌
export const setupTokenCleanupTask = (): void => {
  // 立即清理一次
  cleanExpiredResetTokens().catch((err) => {
    console.error("清理過期令牌失敗:", err);
  });

  // 設置定時任務
  cron.schedule("0 * * * *", async () => {
    try {
      await cleanExpiredResetTokens();
      console.log("成功清理過期重設密碼令牌");
    } catch (err) {
      console.error("清理過期令牌失敗:", err);
    }
  });

  // console.log("已設置定期清理過期重設密碼令牌的任務");
};

export const updateActivityTask = (): void => {
  cron.schedule("0 * * * *", async () => {
    try {
      await updateExpiredActivities();
      // console.log("定期更新活動狀態成功");
    } catch (err) {
      console.error("定期更新活動失敗:", err);
    }
  });
};

export const updateOrderTask = (): void => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await cancelExpiredOrders();
      // console.log("定期更新訂單狀態成功");
    } catch (err) {
      console.error("定期更新訂單失敗:", err);
    }
  });
};

export const updateTicketTask = (): void => {
  cron.schedule("0 * * * *", async () => {
    try {
      await updateExpiredTicket();
      // console.log("定期更新票券狀態成功");
    } catch (err) {
      console.error("定期更新票券失敗:", err);
    }
  });
};

export const setupSchedulers = (): void => {
  setupTokenCleanupTask();
  updateActivityTask();
  updateOrderTask();
  updateTicketTask();
  console.log("Schedulers set up successfully.");
};
