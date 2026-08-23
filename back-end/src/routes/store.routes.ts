import { Request, Response, NextFunction, Router } from "express";
import { allStores, oneStore, productsByStore, oneProduct } from "../db/database.js"
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

const getOneStore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const store = await oneStore(req.params.id);
    res.json(store);
  } catch(error){
    next(error)
  }
}

const getStoreProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const products = await productsByStore(req.params.id);
    res.json(products);
  } catch(error){
    next(error)
  }
};

const getOneProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const products = await oneProduct(req.params.id);
    res.json(products);
  } catch(error){
    next(error)
  }
};


router.get("/", getAllStores);
router.get("/:id", getOneStore);
router.get("/:id/:products", getStoreProducts);
router.get("/products/:id", getOneProduct);

export default router;
