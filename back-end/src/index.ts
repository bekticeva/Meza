import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import storeRouter from "./routes/store.routes.js";
import userRouter from "./routes/users.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import "./db/database.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express 5 and TypeScript");
});

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "meza-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Routes
app.use("/stores", storeRouter);
app.use("/users", userRouter);
app.use("/orders", ordersRouter);

// Central error handler
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});