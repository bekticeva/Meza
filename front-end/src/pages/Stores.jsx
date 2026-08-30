import { useEffect, useState } from "react"
import StoreCard from "../components/StoreCard.jsx";

const API_URL = "http://88.200.63.148:5000";


export default function Stores(){


    const [stores, setStores] = useState([]);

    useEffect(() => {
    async function loadStores() {
      try {
        const res = await fetch(`${API_URL}/stores`);
        const data = await res.json();

        setStores(data);
      } catch (err) {
        console.log("Error loading stores:", err);
      }
    }

    loadStores();
  }, []);

    return (
        <div>{stores.map((store) => (<StoreCard key = {store.id} store = {store}/>))}</div>

        
    )
}