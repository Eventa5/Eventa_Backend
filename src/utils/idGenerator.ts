type IdPrefix = "O" | "T";
import dayjs from "dayjs";

export const generateId = (type: IdPrefix): string => {
  const time = dayjs().tz("Asia/Taipei").format("YYMMDDHHmmss");
  const randomNumber = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `${type}${time}${randomNumber}`;
};
