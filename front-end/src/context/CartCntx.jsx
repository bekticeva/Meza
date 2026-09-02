import { createContext, useContext, useState } from "react"

const CartContext = createContext();

export default function CartProvider({children}){

    const[cart, setCart] = useState({storeId: null, items: []})

    return(
        <CartContext.Provider value={{cart, setCart}}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}