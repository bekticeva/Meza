import { useEffect, useState } from "react";
import { useParams } from "react-router";

const API_URL = "http://88.200.63.148:5000";

export default function Product() {
  const id = useParams().id;

  const [product, setProduct] = useState(null);
  //leftoff
  const [availability, setAvailability] = useState([]);

  async function loadProduct() {
    try {
      const res = await fetch(API_URL + "/stores/products/" + id);
      const data = await res.json();

      setProduct(data[0]);
    } catch (error) {
      console.log("Error loading product", error);
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

    </div>
  );
}
