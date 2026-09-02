export default function QuantityControl({ quantity, setQuantity }) {
  return (

    <div className="quantity">
      <button
        onClick={() => setQuantity(quantity - 1)}
        disabled={quantity === 1}>
        −
      </button>

      <div>{quantity}</div>

      <button onClick={() => setQuantity(quantity + 1)}>
        +
      </button>
    </div>
  );
}