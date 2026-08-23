import mysql from "mysql2/promise";

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
  const [rows] = await pool.query<Products[]>("SELECT * FROM product WHERE id = ? ",[id]);
  return rows;
}



export default pool;