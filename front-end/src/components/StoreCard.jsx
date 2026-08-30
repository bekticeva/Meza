import { Link } from "react-router";

export default function StoreCard({ store }) {
  return (
    <div className="store-card" >
      <h2>{store.name}</h2>
      <p>{store.description}</p>

      <Link to={"/stores/" + store.id} >View Store</Link>
    </div>
  );
}