import { Request, Response, NextFunction, Router } from "express";
import {
    createOrder,
    allOrders,
    updateOrderStatus,
    addOrderItem,
    getAvailability,
    getProduct,
    reduceAvailability,
    getConnection
} from "../db/database.js";

const router = Router();

const createOrderRoute = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const connection = await getConnection();

    try {

    await connection.beginTransaction();

    const {
        user_id,
        delivery_method,
        delivery_address,
        additional_information,
        guest_name,
        guest_email,
        guest_phone,
        items
    } = req.body as {
        user_id?: number | null;
        delivery_method?: string;
        delivery_address?: string | null;
        additional_information?: string | null;
        guest_name?: string | null;
        guest_email?: string | null;
        guest_phone?: string | null;
        items?: {
            product_id: number;
            availability_id: number;
            quantity: number;
            order_price: number;
            special_instructions?: string | null;
            }[];
    };

    if (!delivery_method) {
        res.status(400).json({
            success: false,
            message: "Delivery method is required."
        });
        return;
        }
    
    if (!items || items.length === 0) {
        res.status(400).json(
            {
                success: false,
                message: "At least one product is required."
            }
        );
        return;
    }
    
    console.log("About to create order");

    let totalPrice = 0;
    for(const item of items){
        totalPrice += item.quantity * item.order_price;
    }

    const queryResult = await createOrder(
        connection,
        user_id ?? null,
        delivery_method,
        delivery_address ?? null,
        totalPrice,
        additional_information ?? null,
        guest_name ?? null,
        guest_email ?? null,
        guest_phone ?? null
        );
    
    console.log("Order created", queryResult);

    for (const item of items) {
    const availabilityResult = await getAvailability(
        connection,
        item.availability_id
    );

    const availability = availabilityResult[0];

    if (!availability) {
        throw new Error("Availability not found");
    }

    const productResult = await getProduct(
        connection,
        item.product_id
    );

    const product = productResult[0];

    if (!product) {
        throw new Error("Product not found");
    }

    const requiredCapacity =
        item.quantity * product.capacity_required;

    if (requiredCapacity > availability.remaining_capacity) {
        throw new Error("Not enough capacity available");
    }

    await addOrderItem(
        connection,
        queryResult.insertId,
        item.product_id,
        item.availability_id,
        item.quantity,
        item.order_price,
        item.special_instructions
    );

    await reduceAvailability(
        connection,
        item.availability_id,
        requiredCapacity
    );
}
    await connection.commit();

    if (queryResult.affectedRows === 1) {
        res.status(201).json({
            success: true,
            message: "Order created.",
            orderId: queryResult.insertId
        });

        return;
        }

    res.status(500).json({
        success: false,
        message: "Order was not created."
        });
    
} catch (error) {
    await connection.rollback();
    next(error)
}finally {
  connection.release();
}};

const getOrdersRoute = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const connection = await getConnection();

    try {
        const orders = await allOrders(connection);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
}

const updateOrderStatusRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const connection = await getConnection();

    try {
        const orderId = Number(req.params.id);
        const {status} = req.body as {
            status: string;
        };
        const result = await updateOrderStatus(
            connection, orderId, status
        )

        res.status(200).json({
            success: true,
            message: "Order status updated."
        });

    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
}

router.post("/", createOrderRoute);
router.get("/", getOrdersRoute);
router.put("/:id/status", updateOrderStatusRoute);

export default router;