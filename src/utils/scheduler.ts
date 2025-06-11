import cron from "node-cron";
import { updateExpiredActivities } from "../services/activityService";
import { cancelExpiredOrders } from "../services/orderService";
import { updateExpiredTicket } from "../services/ticketService";
import { cleanExpiredResetTokens } from "../services/userService";

// // 定時清理過期的重設密碼令牌
// export const setupTokenCleanupTask = (): void => {
//   // 立即清理一次
//   cleanExpiredResetTokens().catch((err) => {
//     console.error("清理過期令牌失敗:", err);
//   });

//   // 設置定時任務
//   cron.schedule("0 * * * *", async () => {
//     try {
//       await cleanExpiredResetTokens();
//       console.log("成功清理過期重設密碼令牌");
//     } catch (err) {
//       console.error("清理過期令牌失敗:", err);
//     }
//   });

//   // console.log("已設置定期清理過期重設密碼令牌的任務");
// };

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
