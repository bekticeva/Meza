import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import storeRouter from "./routes/store.routes.js";
import userRouter from "./routes/users.routes.js";
import "./db/database.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express 5 and TypeScript");
});

// Routes
app.use("/stores", storeRouter);
app.use("/users", userRouter);

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