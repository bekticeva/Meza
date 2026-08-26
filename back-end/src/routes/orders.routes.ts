import { Request, Response, NextFunction, Router } from "express";
import { createOrder, addOrderItem } from "../db/database.js";

const router = Router();

const createOrderRoute = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {try {
    const {
        user_id,
        delivery_method,
        delivery_address,
        total_price,
        additional_information,
        guest_name,
        guest_email,
        guest_phone
    } = req.body as {
        user_id?: number | null;
        delivery_method?: string;
        delivery_address?: string | null;
        total_price?: number;
        additional_information?: string | null;
        guest_name?: string | null;
        guest_email?: string | null;
        guest_phone?: string | null;
    };

    if (!delivery_method || !total_price) {
        res.status(400).json({
            success: false,
            message: "Delivery method and total price are required."
        });
        return;
        }
    
    console.log("About to create order");

    const queryResult = await createOrder(
        user_id ?? null,
        delivery_method,
        delivery_address ?? null,
        total_price,
        additional_information ?? null,
        guest_name ?? null,
        guest_email ?? null,
        guest_phone ?? null
        );
    
    console.log("Order created", queryResult);

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
    next(error)
}};


router.post("/", createOrderRoute);

export default router;