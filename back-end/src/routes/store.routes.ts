import { Request, Response, NextFunction, Router } from "express";
import {  allStores, 
          oneStore, 
          productsByStore, 
          oneProduct, 
          createProduct, 
          updateProduct, 
          deleteProduct,
          availabilityByProduct } from "../db/database.js"
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

const getProductAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const availability = await availabilityByProduct(req.params.id);
    res.json(availability);
  } catch(error){
    next(error)
  }
};



// setters ====================================================================================

//add=====================
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

//edit=====================
const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.id);
    
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

    const queryResult = await updateProduct(
      productId,store_id,category_id,collection_id,name,description,price,image_url,is_available
    );

    if (queryResult.affectedRows === 1) {
    res.status(200).json({
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

//delete=====================
const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.id);

    const queryResult = await deleteProduct(productId);

    if(queryResult.affectedRows === 1) {
      res.status(200).json({success:true, message: "Product deleted"});
      return;
    }

    res.status(404).json({success: false, message: "Product not found"})

  } catch (error) {
    next(error);
  }
};




router.get("/", getAllStores);
router.get("/products/:id/availability", getProductAvailability);
router.get("/products/:id", getOneProduct);
router.get("/:id", getOneStore);
router.get("/:id/:products", getStoreProducts);


router.post("/product", addProduct);

router.put("/product/:id", editProduct);

router.delete("/product/:id", removeProduct);

export default router;
