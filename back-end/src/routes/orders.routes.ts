import { Request, Response, NextFunction, Router } from "express";
import { createOrder, addOrderItem, getAvailability } from "../db/database.js";

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
        )
    }
    
    console.log("About to create order");

    let totalPrice = 0;
    for(const item of items){
        totalPrice += item.quantity * item.order_price;
    }

    const queryResult = await createOrder(
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

    for(const item of items){
        const availabilityResult = await getAvailability(item.availability_id);
        const availability = availabilityResult[0];

        if (item.quantity > availability.available_quantity) {
            res.status(400).json({
                success: false,
                message: "Not enough product available."
            });

            return;
            }

        await addOrderItem(
            queryResult.insertId,
            item.product_id,
            item.availability_id,
            item.quantity,
            item.order_price,
            item.special_instructions)
    }

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