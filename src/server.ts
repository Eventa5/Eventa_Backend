import cors from "cors";
import dayjs from "dayjs";
import IsBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dotenv from "dotenv";
import express, { type Express, type Request, type Response } from "express";
import { errorHandler, multerErrorHandler } from "./middlewares/errorHandler";
import routes from "./routes";
import { setupSchedulers } from "./utils/scheduler";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(IsBetween);

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app: Express = express();
const PORT: number | string = process.env.PORT || 3000;
const allowedOrigins = [process.env.EVENTA_FRONTEND_URL, "http://localhost:3000"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // 開發環境允許非瀏覽器
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
setupSchedulers();

app.listen(PORT, () => {
  console.log(`Server is running at ${process.env.EVENTA_BACKEND_URL}`);
});
