import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Calendar from "../components/Calendar.jsx";
import Quantity from "../components/Quantity.jsx";
import { useCart } from "../context/CartCntx.jsx";

const API_URL = "http://88.200.63.148:5000";

export default function Product() {
  const id = useParams().id;

  const [product, setProduct] = useState(null);
  //leftoff
  const [availability, setAvailability] = useState([]);
  const [selDate, setSelDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { cart, setCart } = useCart();

  async function loadProduct() {
    try {
      const res = await fetch(API_URL + "/stores/products/" + id);
      const data = await res.json();

      const prodData = data[0];

      setProduct(prodData);
      loadAvailability(prodData.store_id);
    } catch (error) {
      console.log("Error loading product", error);
    }
  }

  async function loadAvailability(storeId) {
    try {
      const res = await fetch(API_URL + "/stores/" + storeId + "/availability");
      const data = await res.json();

      setAvailability(data);
    } catch (error) {
      console.log("Error loading availabiity", error);
    }
  }

  useEffect(() => {
    loadProduct();
  }, [id]);

  return (
    <div>
      {product && (
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      )}

      <Quantity quantity={quantity} setQuantity={setQuantity} />

      <Calendar availability={availability} onDateSelect={setSelDate} />

      {selDate && <p>Selected date: {selDate}</p>}

      <button
        disabled={!selDate}
        onClick={() => {
          if (cart.storeId !== null && cart.storeId !== product.store_id) {
            alert("your cart contains items from another store.");
            return;
          }

          setCart({
            storeId: product.store_id,
            items: [
              ...cart.items,
              {
                product_id: product.id,
                availability_id: availability.find(
                  (item) => item.available_date === selDate,
                ).id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                date: selDate,
              },
            ],
          });
        }}
      >
        Add to cart
      </button>
    </div>
  );
}
