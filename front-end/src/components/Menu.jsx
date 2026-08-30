import { Link } from "react-router";

export default function Menu() {
  return (
    <nav>
      <Link to="/stores">Stores</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}