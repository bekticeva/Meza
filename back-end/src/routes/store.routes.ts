import { Request, Response, NextFunction, Router } from "express";
import { allStores } from "../db/database.js"
const router = Router();

const getAllStores = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stores = await allStores();
    res.json(stores);
  } catch (error) {
    next(error);
  }
};

router.get("/", getAllStores);

export default router;
