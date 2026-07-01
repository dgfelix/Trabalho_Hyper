import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart precisa estar dentro de CartProvider");
    }
    return context;
};
