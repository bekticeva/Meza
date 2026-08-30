import { Link } from "react-router";

export default function ProductCard({product}) {
    const {id, name, description, price} = product;
    
    return(
        <div className="product-card" >
            <h2>{name}</h2>
            <p>{description}</p>
            <p>{price}</p>

            <Link to={"/products/" + id}>View Product</Link>
        </div>
    
    );
}