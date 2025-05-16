import { Router } from "express";
import { specs, swaggerUi } from "../config/swagger";
import activityRoutes from "./v1/activities";
import categoryRoutes from "./v1/categories";
import currencyRouter from "./v1/currencies";
import orderRoutes from "./v1/orders";
import organizationRoutes from "./v1/organizations";
import ticketTypeRoutes from "./v1/ticketTypes";
import ticketRoutes from "./v1/tickets";
import userRoutes from "./v1/users";

const router = Router();

router.use("/v1/users", userRoutes);
router.use("/v1/activities", activityRoutes);
router.use("/v1/categories", categoryRoutes);
router.use("/v1/tickets", ticketRoutes);
router.use("/v1/ticketTypes", ticketTypeRoutes);
router.use("/v1/orders", orderRoutes);
router.use("/v1/organizations", organizationRoutes);
router.use("/v1/currencies", currencyRouter);

router.get("/docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});
router.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

export default router;
