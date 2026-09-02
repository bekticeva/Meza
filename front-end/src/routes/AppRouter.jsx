import { BrowserRouter, Routes, Route } from "react-router";
import Stores from "../pages/Stores.jsx"
import Store from "../pages/Store.jsx"
import Product from "../pages/Product.jsx"
import MarketPlace from "../pages/MarketPlace.jsx"
import Cart from "../pages/Cart.jsx"
import Checkout from "../pages/Checkout.jsx"
import Menu from "../components/Menu";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Menu />

      <Routes>
        <Route path="/" element={<MarketPlace/>} />
        <Route path="/stores" element={<Stores/>} />
        <Route path="/stores/:id" element={<Store/>} />
        <Route path="/products/:id" element={<Product/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}