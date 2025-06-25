import cron from "node-cron";
import { updateExpiredActivities } from "../services/activityService";
import { cancelExpiredOrders } from "../services/orderService";
import { updateExpiredTicket } from "../services/ticketService";
import {
  activateTicketTypeStatusToTrue,
  deactivateTicketTypeStatus,
} from "../services/ticketTypeService";
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
  const tasks = [
    { name: "清理重設密碼令牌", fn: cleanExpiredResetTokens },
    { name: "檢查已結束活動", fn: updateExpiredActivities },
    { name: "檢查過期票券", fn: updateExpiredTicket },
  ];

  for (const task of tasks) {
    try {
      await task.fn();
      console.log(`[${prefix}] ${task.name} 成功`);
    } catch (err) {
      console.error(`[${prefix}] ${task.name} 失敗: ${err instanceof Error ? err.message : err}`);
    }
  }
};

export const hourlyTask = (): void => {
  // 啟動時立即執行一次
  (async () => {
    try {
      await runHourlyTasks("Init");
    } catch (err) {
      console.error(`[Init] hourlyTask 失敗: ${err instanceof Error ? err.message : err}`);
    }
  })();

  // 設定每小時排程
  cron.schedule("0 * * * *", async () => {
    await runHourlyTasks("Hourly");
  });
};

export const updateTicketTypeStatusTask = (): void => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await activateTicketTypeStatusToTrue();
    } catch (err) {
      console.error(`更新票種啟用狀態失敗：${err instanceof Error ? err.message : err}`);
    }
  });

  cron.schedule("0 0 * * *", async () => {
    try {
      await deactivateTicketTypeStatus();
    } catch (err) {
      console.error(`更新票種關閉狀態失敗：${err instanceof Error ? err.message : err}`);
    }
  });
};

export const setupSchedulers = (): void => {
  updateOrderTask();
  hourlyTask();
  updateTicketTypeStatusTask();
  console.log("Schedulers set up successfully.");
};
