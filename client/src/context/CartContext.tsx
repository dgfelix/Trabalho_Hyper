import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { ICartItem, IProduct } from "@/commons/types";

const CART_STORAGE_KEY = "cart";
const PIX_DISCOUNT = 0.05;

// ---------------------------------------------------------------------------
// Tipos do contexto
// ---------------------------------------------------------------------------

interface CartContextType {
    items: ICartItem[];
    totalItems: number;
    subtotal: number;
    discount: number;
    total: number;
    addItem: (product: IProduct, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

// ---------------------------------------------------------------------------
// Contexto e provider
// ---------------------------------------------------------------------------

export const CartContext = createContext({} as CartContextType);

const loadFromStorage = (): ICartItem[] => {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ICartItem[]) : [];
    } catch {
        return [];
    }
};

const saveToStorage = (items: ICartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<ICartItem[]>(loadFromStorage);

    // Persiste no localStorage sempre que o carrinho mudar
    useEffect(() => {
        saveToStorage(items);
    }, [items]);

    // Totais calculados
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal   = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const discount   = subtotal * PIX_DISCOUNT;
    const total      = subtotal - discount;

    // Adiciona produto — se já existe, incrementa a quantidade
    const addItem = useCallback((product: IProduct, quantity = 1) => {
        setItems((prev) => {
            const exists = prev.find((i) => i.product.id === product.id);
            if (exists) {
                return prev.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { product, quantity }];
        });
    }, []);

    // Remove produto do carrinho
    const removeItem = useCallback((productId: number) => {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
    }, []);

    // Atualiza quantidade — remove se chegar a 0
    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.product.id !== productId));
        } else {
            setItems((prev) =>
                prev.map((i) =>
                    i.product.id === productId ? { ...i, quantity } : i
                )
            );
        }
    }, []);

    // Esvazia o carrinho
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    return (
        <CartContext.Provider
            value={{ items, totalItems, subtotal, discount, total, addItem, removeItem, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
