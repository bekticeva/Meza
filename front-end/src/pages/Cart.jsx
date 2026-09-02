import { useCart } from "../context/CartCntx.jsx";
import { useNavigate } from "react-router";

export default function Cart() {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  console.log(cart);

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div>
      <h1>Your Cart</h1>

      {cart.items.length === 0 ? (
        <p>Empty</p>
      ) : (
        <div>
          <p>Store id: {cart.storeId}</p>

          {cart.items.map((item, index) => (
            <div key={index} className="cart-item">
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Date: {item.date}</p>
              <p>Subtotal: {item.price * item.quantity}</p>

              <button
                onClick={() => {
                  const updatedItems = cart.items.filter((_, i) => i !== index);

                  setCart({
                    storeId: updatedItems.length === 0 ? null : cart.storeId,
                    items: updatedItems,
                  });
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <h2>Total: {total}</h2>

          <button
            onClick={() => navigate("/checkout")}
            disabled={cart.items.length === 0}>
            Continue to checkout
          </button>
        </div>
      )}
    </div>
  );
}
