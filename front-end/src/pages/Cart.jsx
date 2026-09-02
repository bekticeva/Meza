import {useCart} from "../context/CartCntx.jsx"
export default function Cart(){

  const {cart} = useCart();

  return(
    <div>
      <h1>Your Cart</h1>

      {cart.items.lenght === 0 ? (<p>Empty</p>) : (
        <div>
          <p>Store id: {cart.storeId}</p>

          {cart.items.map((item, index) => (
            <div key={index}>
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Date: {item.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}