type IdPrefix = "O" | "T";

export const generateId = (type: IdPrefix): string => {
  const now = new Date();
  const time = now.toISOString().slice(2, 19).replace(/[-T:]/g, "").slice(0, 12);
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(5, "0");
  return `${type}${time}${randomNumber}`;
};
