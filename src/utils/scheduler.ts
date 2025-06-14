import cron from "node-cron";
import { updateExpiredActivities } from "../services/activityService";
import { cancelExpiredOrders } from "../services/orderService";
import { updateExpiredTicket } from "../services/ticketService";
import { cleanExpiredResetTokens } from "../services/userService";

export const updateOrderTask = (): void => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await cancelExpiredOrders();
    } catch (err) {
      console.error("定期更新訂單失敗:", err);
    }
  });
};

const taskNames = ["清理重設密碼令牌", "檢查已結束活動", "檢查過期票券"];
const runHourlyTasks = async (prefix: string) => {
  const results = await Promise.allSettled([
    cleanExpiredResetTokens(),
    updateExpiredActivities(),
    updateExpiredTicket(),
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`[${prefix}] ${taskNames[index]} 成功`);
    } else {
      console.error(`[${prefix}] ${taskNames[index]} 失敗:`, result.reason);
    }
  });
};

export const hourlyTask = (): void => {
  // 啟動時立即執行一次
  runHourlyTasks("Init");

  // 設定每小時排程
  cron.schedule("0 * * * *", async () => {
    await runHourlyTasks("Hourly");
  });
};

export const setupSchedulers = (): void => {
  updateOrderTask();
  hourlyTask();
  console.log("Schedulers set up successfully.");
};
