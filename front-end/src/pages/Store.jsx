import { useParams } from "react-router";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx"

const API_URL =  "http://88.200.63.148:5000";



export default function Store() {
    const id = useParams().id;
    const [products, setProducts] = useState([]);
    const [store, setStore] = useState(null);

    async function loadProducts() {
        try {
            const res = await fetch(API_URL + "/stores/" + id + "/products");
            const data = await res.json();

            setProducts(data);
        } catch (error) {
            console.log("Error loading products", error);
        }
    }

    async function loadStoreInfo() {
        try {
            const res = await fetch(API_URL + "/stores/" + id);
            const data = await res.json();

            setStore(data[0]);
        } catch (error) {
            console.log("Error loading products", error);
        }
    }

    useEffect(() => {
        loadStoreInfo();
        loadProducts();
    }, [id]);

    return(
        <div>
            {store && <h1>{store.name}</h1>}
            
            {
                products.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                        
                ))
            }
        </div>
    )
}