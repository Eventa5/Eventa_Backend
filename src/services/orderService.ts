import { OrderStatus, TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import ecpay_payment, { type Options } from "ecpay_aio_nodejs";
import prisma from "../prisma/client";

import type {
  CreateOrderSchema,
  OrderForGenerateCheckoutHtml,
  OrderQuerySchema,
} from "../schemas/zod/order.schema";
import { generateId } from "../utils/idGenerator";
import * as paginator from "../utils/paginator";
import { PaymentTypes } from "../utils/paymentTypes";

const ECPayPaymentOptions: Options = {
  OperationMode: "Test",
  MercProfile: {
    MerchantID: process.env.ECPAY_MERCHANT_ID || "",
    HashKey: process.env.ECPAY_HASH_KEY || "",
    HashIV: process.env.ECPAY_HASH_IV || "",
  },
  IgnorePayment: [],
  IsProjectContractor: false,
};

const CorrectRtnCode = "1";

export const createOrder = async (userId: number, data: CreateOrderSchema) => {
  const { activityId, tickets: ticketTypesData, paidAmount, invoice } = data;
  const orderId = generateId("O");
  const tickets: { id: number; refundDeadline: Date }[] = [];

  for (const ticketTypeData of ticketTypesData) {
    const { id, quantity, refundDeadline } = ticketTypeData;
    for (let i = 1; i <= quantity; i++) {
      tickets.push({
        id,
        refundDeadline: refundDeadline || dayjs().add(7, "day").toDate(),
      });
    }
  }

  return prisma.$transaction(async (tx) => {
    const activity = await tx.activity.findUnique({
      where: { id: activityId },
      select: {
        isOnline: true,
        livestreamUrl: true,
      },
    });

    const order = await tx.order.create({
      data: {
        id: orderId,
        createdAt: dayjs().toDate(),
        paidExpiredAt: dayjs().add(10, "minutes").toDate(),
        user: {
          connect: {
            id: userId,
          },
        },
        activity: {
          connect: {
            id: activityId,
          },
        },
        tickets: {
          create: tickets.map(({ id, refundDeadline }) => {
            const ticketId = generateId("T");

            return {
              id: ticketId,
              qrCodeToken:
                activity?.isOnline && activity?.livestreamUrl ? activity.livestreamUrl : "",
              refundDeadline,
              ticketType: {
                connect: {
                  id,
                },
              },
              activity: {
                connect: {
                  id: activityId,
                },
              },
            };
          }),
        },
        orderItems: {
          create: ticketTypesData.map(({ id, quantity }) => ({
            ticketType: {
              connect: {
                id,
              },
            },
            quantity,
          })),
        },
        payment: {
          create: {
            paidAmount,
          },
        },
        ...invoice,
      },
      select: {
        id: true,
        paidExpiredAt: true,
        createdAt: true,
        invoiceAddress: true,
        invoiceTitle: true,
        invoiceTaxId: true,
        invoiceReceiverName: true,
        invoiceReceiverPhoneNumber: true,
        invoiceReceiverEmail: true,
        invoiceCarrier: true,
        invoiceType: true,
        activity: {
          select: {
            id: true,
            title: true,
          },
        },
        orderItems: {
          select: {
            ticketType: {
              select: {
                name: true,
                price: true,
                startTime: true,
                endTime: true,
              },
            },
            quantity: true,
          },
        },
        payment: {
          select: {
            paidAmount: true,
          },
        },
      },
    });

    await Promise.all(
      ticketTypesData.map(({ id, quantity }) =>
        tx.ticketType.update({
          where: { id },
          data: {
            remainingQuantity: {
              decrement: quantity,
            },
          },
        }),
      ),
    );

    return order;
  });
};

export const getOrders = async (userId: number, queries: OrderQuerySchema) => {
  const { page, limit, status, title, from, to } = queries;
  const offset = paginator.getOffset(page, limit);
  const where: Record<string, any> = {
    userId,
  };

  if (status) {
    where.status = status;
  }

  if (title) {
    where.activity = {
      title: {
        contains: title,
        mode: "insensitive",
      },
    };
  }

  if (from && to) {
    const fromDate = dayjs(from).toDate();
    const toDate = dayjs(to).toDate();

    where.activity = {
      ...(where.activity || {}),
      OR: [
        {
          startTime: {
            gte: fromDate,
            lte: toDate,
          },
        },
        {
          endTime: {
            gte: fromDate,
            lte: toDate,
          },
        },
      ],
    };
  }

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      select: {
        id: true,
        status: true,
        paidAt: true,
        paidExpiredAt: true,
        createdAt: true,
        activity: {
          select: {
            id: true,
            title: true,
            location: true,
            isOnline: true,
            startTime: true,
            endTime: true,
          },
        },
        payment: {
          select: {
            method: true,
          },
        },
      },
      orderBy: [
        {
          activity: {
            startTime: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      skip: offset,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const pagination = paginator.getPagination(totalItems, page, limit);

  return {
    orders,
    pagination,
  };
};

export const getOrderDetail = async (userId: number, orderId: string) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      paidAt: true,
      paidExpiredAt: true,
      status: true,
      invoiceAddress: true,
      invoiceReceiverName: true,
      invoiceReceiverEmail: true,
      invoiceReceiverPhoneNumber: true,
      invoiceTitle: true,
      invoiceTaxId: true,
      invoiceCarrier: true,
      invoiceType: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          displayName: true,
          email: true,
          phoneNumber: true,
          gender: true,
        },
      },
      activity: {
        select: {
          id: true,
          title: true,
          tags: true,
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          endTime: true,
        },
      },
      payment: {
        select: {
          method: true,
          paidAmount: true,
        },
      },
      tickets: {
        select: {
          id: true,
          status: true,
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedName: true,
          assignedEmail: true,
          refundDeadline: true,
          ticketType: {
            select: {
              id: true,
              name: true,
              price: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });
};

export const getOrder = async (userId: number, orderId: string) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      status: true,
      invoiceAddress: true,
      invoiceTitle: true,
      invoiceTaxId: true,
      invoiceReceiverName: true,
      invoiceReceiverPhoneNumber: true,
      invoiceReceiverEmail: true,
      invoiceCarrier: true,
      invoiceType: true,
      activity: {
        select: {
          id: true,
          title: true,
        },
      },
      orderItems: {
        select: {
          ticketType: {
            select: {
              name: true,
              price: true,
            },
          },
          quantity: true,
        },
      },
      payment: {
        select: {
          paidAmount: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          displayName: true,
        },
      },
    },
  });
};

export const cancelOrder = async (orderId: string) =>
  prisma.$transaction(async (tx) => {
    await tx.ticket.updateMany({
      where: { orderId },
      data: { status: TicketStatus.canceled },
    });

    const orderItem = await tx.orderItem.findMany({
      where: { orderId },
      select: {
        ticketTypeId: true,
        quantity: true,
      },
    });

    await Promise.all(
      orderItem.map(({ ticketTypeId, quantity }) =>
        tx.ticketType.update({
          where: { id: ticketTypeId },
          data: {
            remainingQuantity: {
              increment: quantity,
            },
          },
        }),
      ),
    );

    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.canceled },
    });
  });

export const generateCheckoutHtml = async (order: OrderForGenerateCheckoutHtml) => {
  const MerchantTradeNo = order.id.padStart(20, "0");
  const MerchantTradeDate = dayjs().utc().format("YYYY/MM/DD HH:mm:ss");
  const TotalAmount = order.payment.paidAmount.toString();
  const ItemName = order.orderItems
    .map(({ ticketType: { name }, quantity }) => {
      return `${name} x ${quantity}`;
    })
    .join("#");

  const base_param = {
    MerchantTradeNo,
    MerchantTradeDate,
    TotalAmount,
    TradeDesc: `${order.id} 訂單付款資訊`,
    ItemName,
    ReturnURL: `${process.env.EVENTA_BACKEND_URL}/api/v1/orders/return`,
    ClientBackURL: `${process.env.EVENTA_FRONTEND_URL}/events/${order.activity.id}/checkout/result?orderId=${order.id}`,
    CustomField1: order.user.id.toString(),
    CustomField2: order.user.displayName || order.user.name || "-",
    CustomField3: order.user.email,
  };

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.processing,
    },
  });

  const create = new ecpay_payment(ECPayPaymentOptions);
  const html = create.payment_client.aio_check_out_all(base_param);

  return html;
};

export const checkIsMacValueValid = (checkMacValue: string, data: Record<string, any>) => {
  const create = new ecpay_payment(ECPayPaymentOptions);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  return checkMacValue === checkValue;
};

export const updateOrderPayment = async (rawData: Record<string, string>) => {
  const {
    MerchantTradeNo,
    PaymentType,
    TradeNo,
    PaymentDate,
    RtnCode,
    CustomField1,
    CustomField2,
    CustomField3,
  } = rawData;
  const orderId = MerchantTradeNo.slice(MerchantTradeNo.indexOf("O"));
  const paidAt = PaymentDate || dayjs().utc().format("YYYY-MM-DD HH:mm:ss");
  const userId = Number.parseInt(CustomField1, 10);
  const userName = CustomField2;
  const userEmail = CustomField3;

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        status: true,
      },
    });

    if (!order || order.status !== OrderStatus.processing) {
      throw new Error("訂單錯誤，或是訂單不是「付款中」，無法更新");
    }

    const data: Record<string, string | number | Date | object> = {
      method: PaymentTypes[PaymentType],
      rawData: JSON.stringify(rawData),
      tradeId: TradeNo,
      paidAt,
    };

    if (RtnCode === CorrectRtnCode) {
      data.order = {
        update: {
          status: OrderStatus.paid,
          paidAt,
          tickets: {
            updateMany: {
              where: { orderId },
              data: {
                status: TicketStatus.assigned,
                assignedUserId: userId,
                assignedEmail: userEmail,
                assignedName: userName,
              },
            },
          },
        },
      };
    } else {
      data.order = {
        update: {
          status: OrderStatus.failed,
          paidAt,
        },
      };
    }

    await tx.payment.update({
      where: { orderId },
      data,
    });
  });
};

export const cancelExpiredOrders = async () => {
  try {
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      const expiredOrders = await tx.order.findMany({
        where: {
          paidExpiredAt: {
            lte: now,
          },
          status: OrderStatus.pending,
        },
        select: {
          id: true,
        },
      });

      const expiredOrderIds = expiredOrders.map((order) => order.id);

      if (expiredOrderIds.length === 0) {
        return;
      }

      // 更新訂單狀態
      await tx.order.updateMany({
        where: { id: { in: expiredOrderIds } },
        data: { status: OrderStatus.expired },
      });

      // 更新票券狀態
      await tx.ticket.updateMany({
        where: { orderId: { in: expiredOrderIds } },
        data: { status: TicketStatus.canceled },
      });

      // 釋放票券
      const affectedTickets = await tx.ticket.groupBy({
        by: ["ticketTypeId"],
        where: {
          orderId: { in: expiredOrderIds },
        },
        _count: { _all: true },
      });

      for (const ticket of affectedTickets) {
        await tx.ticketType.update({
          where: { id: ticket.ticketTypeId },
          data: {
            remainingQuantity: {
              increment: ticket._count._all,
            },
          },
        });
      }
    });
  } catch (err) {
    throw new Error(`更新已過期訂單狀態失敗：${err instanceof Error ? err.message : err}`);
  }
};
