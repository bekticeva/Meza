import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export interface Store extends RowDataPacket {
  id: number;
  seller_id: number;
  name: string;
  url: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  city: string;
  address: string | null;
  is_active: number;
  accepts_pickup: number;
  accepts_delivery: number;
}

export interface Product extends RowDataPacket {
  id: number;
  store_id: number;
  category_id: number;
  collection_id: number | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: number;
}

// getters ====================================================================================

export const allStores = async (): Promise<Store[]> => {
  const [rows] = await pool.query<Store[]>("SELECT * FROM store");
  return rows;
};

export const oneStore = async (id: string) : Promise<Store[]> => {
  const [rows] = await pool.query<Store[]>("SELECT * FROM store WHERE id = ?",[id]);
  return rows;
}

export const productsByStore = async (id: string) : Promise<Product[]> => {
  const [rows] = await pool.query<Products[]>("SELECT * FROM product WHERE store_id = ?",[id]);
  return rows;
}

export const oneProduct = async (id: string) : Promise<Product[]> => {
  const [rows] = await pool.query<Product[]>("SELECT * FROM product WHERE id = ? ",[id]);
  return rows;
}

// setters ====================================================================================

export const createProduct = async (
  storeId: number,
  categoryId: number,
  collectionId: number | null,
  name: string,
  description: string | null,
  price: number,
  imageUrl: string | null,
  isAvailable: number
) : Promise<ResultSetHeader> => {
  const [rows] = await pool.query<ResultSetHeader>( "INSERT INTO product (store_id, category_id, collection_id, name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      storeId,
      categoryId,
      collectionId,
      name,
      description,
      price,
      imageUrl,
      isAvailable
    ]
  );
  return rows;
}

export const updateProduct = async (
  id: number,
  storeId: number,
  categoryId: number,
  collectionId: number | null,
  name: string,
  description: string | null,
  price: number,
  imageUrl: string | null,
  isAvailable: number
) : Promise<ResultSetHeader> => {
  const [rows] = await pool.query<ResultSetHeader>( "UPDATE product SET store_id = ?, category_id = ?, collection_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_available = ? WHERE id = ?",
    [
      storeId,
      categoryId,
      collectionId,
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      id
    ]
  );
  return rows;
}

export const deleteProduct = async (id: number) : Promise<ResultSetHeader> => {
  const[result] = await pool.query<ResultSetHeader>("DELETE FROM product WHERE id = ?", [id]);
  return result;
}

export default pool;