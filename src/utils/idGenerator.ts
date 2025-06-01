type IdPrefix = "O" | "T";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

export const generateId = (type: IdPrefix): string => {
  const time = dayjs().tz("Asia/Taipei").format("YYMMDDHHmmss");
  const randomNumber = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `${type}${time}${randomNumber}`;
};
