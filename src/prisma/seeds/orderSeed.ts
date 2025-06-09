import { OrderStatus, type Prisma, PrismaClient } from "@prisma/client";
import { generateId } from "../../utils/idGenerator";

const prisma = new PrismaClient();

export const seedOrders = async () => {
  const existing = await prisma.order.count();
  if (existing) return console.log("orders already seeded.");

  await prisma.order.create({
    data: {
      id: generateId("O"),
      userId: 2,
      activityId: 1,
      status: OrderStatus.pending,
      invoiceType: "b2c",
      invoiceCarrier: "/ABC1234",
      orderItems: {
        create: [{ ticketTypeId: 1, quantity: 1 }],
      },
      tickets: {
        create: [
          {
            id: generateId("T"),
            ticketTypeId: 1,
            activityId: 1,
            status: "assigned",
            assignedUserId: 2,
            assignedName: "王大明",
            assignedEmail: "test@test.com",
            qrCodeToken: "exampleToken123",
            refundDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        ],
      },
    },
  });
  console.log("🌱 orders seeded successfully.");
};
