import cors from "cors";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dotenv from "dotenv";
import express, { type Express, type Request, type Response } from "express";
import { errorHandler, multerErrorHandler } from "./middlewares/errorHandler";
import routes from "./routes";
import { setupTokenCleanupTask } from "./utils/scheduler";
dayjs().format();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app: Express = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi world!");
});

// routes
app.use("/api", routes);

// error handler
app.use(multerErrorHandler);
app.use(errorHandler);

// 設置定時任務
setupTokenCleanupTask();

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
