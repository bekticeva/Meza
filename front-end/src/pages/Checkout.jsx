import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartCntx.jsx";

export default function Checkout() {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const placeOrder = async (e) => {
    e.preventDefault();

    const form = e.target;

    const formData = new FormData(form);

    const guestName = formData.get("name");
    const guestEmail = formData.get("email");
    const guestPhone = formData.get("phone");
    const deliveryAddress = formData.get("deliveryAddress");

    try {
      const res = await fetch("http://88.200.63.148:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          delivery_address: deliveryAddress,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          items: cart.items.map((item) => ({
            product_id: item.product_id,
            availability_id: item.availability_id,
            quantity: item.quantity,
            order_price: item.price,
            special_instructions: null,
          })),
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.success) {
        setCart({
          storeId: null,
          items: [],
        });
        alert("Order placed!");
        navigate("/cart");
      }
    } catch (error) {
      console.log("Error creating order", error);
    }
  };

  return (
    <form onSubmit={placeOrder}>
      <h1>Checkout</h1>

      <h2>Customer information</h2>

      <label>
        Name
        <input type="text" name="name" required />
      </label>

      <label>
        Email
        <input type="email" name="email" required />
      </label>

      <label>
        Phone
        <input type="tel" name="phone" required />
      </label>

      <h2>Delivery method</h2>

      <label>
        <input
          type="radio"
          name="deliveryMethod"
          value="pickup"
          checked={deliveryMethod === "pickup"}
          onChange={(e) => setDeliveryMethod(e.target.value)}
        />
        Pickup
      </label>

      <label>
        <input
          type="radio"
          name="deliveryMethod"
          value="delivery"
          checked={deliveryMethod === "delivery"}
          onChange={(e) => setDeliveryMethod(e.target.value)}
        />
        Delivery
      </label>

      {deliveryMethod === "delivery" && (
        <label>
          Delivery address
          <input type="text" name="deliveryAddress" required />
        </label>
      )}

      <h2>Payment method</h2>

      <label>
        <input
          type="radio"
          name="paymentMethod"
          value="Cash"
          checked={paymentMethod === "Cash"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash
      </label>

      <label>
        <input
          type="radio"
          name="paymentMethod"
          value="Card"
          checked={paymentMethod === "Card"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Card
      </label>

      <h2>Order Summary</h2>

      <p>Store: {cart.storeId}</p>

      {cart.items.map((item, index) => (
        <div key={index}>
          <p>{item.name}</p>
          <p>
            €{item.price} × {item.quantity}
          </p>
          <p>Date: {item.date}</p>
        </div>
      ))}
      <button type="submit">Place Order</button>
    </form>
  );
}
