import { BrowserRouter, Routes, Route } from "react-router";
import Stores from "../pages/Stores.jsx"
import MarketPlace from "../pages/MarketPlace.jsx"
import Menu from "../components/Menu";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Menu />

      <Routes>
        <Route path="/" element={<MarketPlace/>} />
        <Route path="/stores" element={<Stores/>} />
      </Routes>
    </BrowserRouter>
  );
}