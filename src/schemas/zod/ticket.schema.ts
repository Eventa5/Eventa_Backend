import { z } from "zod";

export const ticketIdSchema = z.string().regex(/^T\d{17}$/, {
  message: "ticketId 格式錯誤，應為 T 開頭後接 17 位數字",
});

export type TicketId = z.infer<typeof ticketIdSchema>;
