import mysql, { ResultSetHeader, RowDataPacket, PoolConnection } from "mysql2/promise";
import bcrypt from "bcrypt";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getConnection = async () => {
  return await pool.getConnection();
}

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

export interface User extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string | null;
  profile_picture: string | null;
  created_at: Date;
}

export interface Order extends RowDataPacket {
  id: number;
  user_id: number | null;
  ordered_at: Date;
  status: string;
  delivery_method: string;
  delivery_address: string | null;
  total_price: number;
  additional_information: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
}

export interface OrderItem extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number;
  availability_id: number;
  quantity: number;
  order_price: number;
  special_instructions: string | null;
}

export interface Availability extends RowDataPacket {
  id: number;
  product_id: number;
  available_date: Date;
  pickup_time: string;
  available_quantity: number;
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
//products========
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
//products========

//users========

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<ResultSetHeader> => {

  const hashedPass = await bcrypt.hash(password,10);

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, hashedPass]
  );
  return result;
};


export const authUser = async (email: string): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );

  return rows;
};

export const authUserById = async (
  id: number
): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(
    "SELECT * FROM user WHERE id = ?",
    [id]
  );

  return rows;
};

//users========

//orders========
export const createOrder = async (
  connection: PoolConnection,
  userId: number | null,
  deliveryMethod: string,
  deliveryAddress: string | null,
  totalPrice: number,
  additionalInformation: string | null,
  guestName: string | null,
  guestEmail: string | null,
  guestPhone: string | null
): Promise<ResultSetHeader> => {
  const [result] = await connection.query<ResultSetHeader>(
    `INSERT INTO \`order\`
    (user_id, delivery_method, delivery_address, total_price,
     additional_information, guest_name, guest_email, guest_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      deliveryMethod,
      deliveryAddress,
      totalPrice,
      additionalInformation,
      guestName,
      guestEmail,
      guestPhone
    ]
  );

  return result;
};


export const addOrderItem = async (
  connection: PoolConnection,
  orderId: number,
  productId: number,
  availabilityId: number,
  quantity: number,
  orderPrice: number,
  specialInstructions: string | null
): Promise<ResultSetHeader> => {
  const [result] = await connection.query<ResultSetHeader>(
    `INSERT INTO order_product
    (order_id, product_id, availability_id, quantity, order_price, special_instructions)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      orderId,
      productId,
      availabilityId,
      quantity,
      orderPrice,
      specialInstructions
    ]
  );

  return result;
};


export const getAvailability = async (
  connection: PoolConnection,
  id: number,
  productId: number
) : Promise <Availability[]> => {
  const[rows] = await connection.query<Availability[]> ("SELECT * FROM availability WHERE id = ? AND product_id = ?",[id, productId]);
  return rows;
}

export const reduceAvailability = async (
  connection: PoolConnection,
  id: number,
  quantity: number
) : Promise <ResultSetHeader> => {
  const[rows] = await connection.query<ResultSetHeader> ("UPDATE availability SET available_quantity = available_quantity - ? WHERE id = ?",[quantity, id]
  )
}
//orders========



export default pool;