import { Request, Response, NextFunction, Router } from "express";
import { allStores, oneStore, productsByStore, oneProduct, createProduct } from "../db/database.js"
const router = Router();


// getters ====================================================================================

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

// setters ====================================================================================

const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const {
      store_id,
      category_id,
      collection_id,
      name,
      description,
      price,
      image_url,
      is_available
    } = req.body as {
      store_id?: number;
      category_id?: number;
      collection_id?: number | null;
      name?: string;
      description?: string | null;
      price?: number;
      image_url?: string | null;
      is_available?: number;
    };

    if (!store_id || !category_id || !name || !price) {
    res.status(400).json({
      success: false,
      message: "missing fields.",
    });
      return;
    }

    const queryResult = await createProduct(
      store_id,category_id,collection_id,name,description,price,image_url,is_available
    );

    if (queryResult.affectedRows === 1) {
    res.status(201).json({
      success: true,
      message: "Product added."
    });

    return;
    }

    res.status(500).json({
      success: false,
      message: "News item was not added.",
    });

  } catch (error) {
    next(error)
  }
}

router.get("/", getAllStores);
router.get("/:id", getOneStore);
router.get("/:id/:products", getStoreProducts);
router.get("/products/:id", getOneProduct);

router.post("/product", addProduct);

export default router;
