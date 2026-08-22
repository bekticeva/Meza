import { Request, Response, NextFunction, Router } from "express";

const router = Router();

const getAllNews = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("The /news route has been reached");
    res.send("news");
  } catch (error) {
    next(error);
  }
};

router.get("/", getAllNews);

export default router;
