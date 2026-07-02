import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import ProductService from "@/services/product-service";
import type { IProduct } from "@/commons/types";
import { resolveProductImage } from "@/lib/product-image";
import { useCart } from "@/context/hooks/use-cart";

interface CarrosselProps {
    categoryId: number;
    title: string;
    /** Produtos pré-carregados. Se fornecido, não faz chamada à API. */
    products?: IProduct[];
}

// ---------------------------------------------------------------------------
// Card de produto — mesmo estilo da tela /products
// ---------------------------------------------------------------------------

interface CardProps {
    product: IProduct;
    onView: () => void;
    onAddToCart: () => void;
}

const ProductCard: React.FC<CardProps> = ({ product, onView, onAddToCart }) => {
    const [hovered, setHovered] = useState(false);
    const pixPrice = product.price * 0.95;
    const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "240px",
                flexShrink: 0,
                background: "#1f2937",
                border: `1px solid ${hovered ? "#3b82f6" : "#374151"}`,
                borderRadius: "14px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                boxShadow: hovered ? "0 8px 24px rgba(59,130,246,0.15)" : "none",
                cursor: "pointer",
            }}
        >
            {/* Imagem */}
            <div
                onClick={onView}
                style={{ width: "100%", height: "180px", background: "#111827", overflow: "hidden", flexShrink: 0 }}
            >
                <img
                    src={resolveProductImage(product.imagePath, product.name)}
                    alt={product.name}
                    loading="lazy"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                        transform: hovered ? "scale(1.06)" : "scale(1)",
                    }}
                />
            </div>

            {/* Corpo */}
            <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
                {/* Badge categoria */}
                <span style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#60a5fa",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    textAlign: "center",
                }}>
                    {product.category?.name}
                </span>

                {/* Nome */}
                <p
                    onClick={onView}
                    style={{
                        color: "#f3f4f6",
                        fontSize: "14px",
                        fontWeight: 600,
                        margin: 0,
                        lineHeight: 1.4,
                        textAlign: "center",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {product.name}
                </p>

                {/* Preços */}
                <div style={{ marginTop: "auto", paddingTop: "8px", textAlign: "center" }}>
                    <p style={{ color: "#6b7280", fontSize: "11px", textDecoration: "line-through", margin: "0 0 2px" }}>
                        {fmt(product.price)}
                    </p>
                    <p style={{ color: "#4ade80", fontSize: "16px", fontWeight: 800, margin: "0 0 2px" }}>
                        {fmt(pixPrice)}
                        <span style={{ color: "#6b7280", fontSize: "10px", fontWeight: 400, marginLeft: "4px" }}>no PIX</span>
                    </p>
                    <p style={{ color: "#9ca3af", fontSize: "11px", margin: 0 }}>
                        ou {fmt(product.price)} em até 12x
                    </p>
                </div>

                {/* Ações */}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                        onClick={onAddToCart}
                        style={{
                            flex: 1,
                            background: "#ea580c",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "9px 0",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#c2410c")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#ea580c")}
                    >
                        <i className="pi pi-cart-plus" />
                        Comprar
                    </button>

                    <button
                        onClick={onView}
                        title="Ver detalhes"
                        style={{
                            background: "#374151",
                            border: "none",
                            borderRadius: "8px",
                            color: "#9ca3af",
                            width: "36px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.15s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#4b5563")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#374151")}
                    >
                        <i className="pi pi-eye" style={{ fontSize: "14px" }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Carrossel
// ---------------------------------------------------------------------------

export const Carrossel: React.FC<CarrosselProps> = ({ categoryId, title, products: productsProp }) => {
    const [products, setProducts]   = useState<IProduct[]>(productsProp ?? []);
    const [loading, setLoading]     = useState(!productsProp);
    const [error, setError]         = useState<string | null>(null);
    const scrollContainerRef        = useRef<HTMLDivElement>(null);
    const toast                     = useRef<Toast>(null);
    const navigate                  = useNavigate();
    const { addItem }               = useCart();

    const MAX_PRODUCTS_DISPLAY = 5;
    const SCROLL_AMOUNT        = 280;

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ProductService.findByCategory(categoryId);
            if (response.success && response.data) {
                const limited = Array.isArray(response.data)
                    ? response.data.slice(0, MAX_PRODUCTS_DISPLAY)
                    : [];
                setProducts(limited);
            } else {
                setError(response.message || "Erro ao carregar produtos");
            }
        } catch {
            setError("Não foi possível carregar os produtos");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        if (productsProp) {
            setProducts(productsProp.slice(0, MAX_PRODUCTS_DISPLAY));
            setLoading(false);
            return;
        }
        loadProducts();
    }, [productsProp, loadProducts]);

    const scroll = useCallback((direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (!container) return;
        container.scrollTo({
            left: direction === "left"
                ? container.scrollLeft - SCROLL_AMOUNT
                : container.scrollLeft + SCROLL_AMOUNT,
            behavior: "smooth",
        });
    }, []);

    const handleAddToCart = (product: IProduct) => {
        addItem(product, 1);
        toast.current?.show({
            severity: "success",
            summary: "Adicionado",
            detail: `${product.name} adicionado ao carrinho.`,
            life: 2000,
        });
    };

    if (loading) {
        return (
            <div style={{ width: "100%", padding: "0 16px" }}>
                <h2 style={{ color: "#e5e7eb", fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>{title}</h2>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "260px" }}>
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ width: "100%", padding: "0 16px" }}>
                <h2 style={{ color: "#e5e7eb", fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>{title}</h2>
                <div style={{ textAlign: "center", color: "#f87171", padding: "32px", background: "#1f2937", borderRadius: "12px", border: "1px solid #7f1d1d" }}>
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: "32px", marginBottom: "12px", display: "block" }} />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div style={{ width: "100%", padding: "0 16px" }}>
            <Toast ref={toast} />

            {/* Cabeçalho da seção */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <h2 style={{ color: "#f3f4f6", fontSize: "22px", fontWeight: 700, margin: 0 }}>{title}</h2>
                    <div style={{ height: "3px", width: "40px", background: "#3b82f6", borderRadius: "2px", marginTop: "6px" }} />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                        icon="pi pi-chevron-left"
                        className="p-button-rounded p-button-text"
                        onClick={() => scroll("left")}
                        style={{ color: "#9ca3af" }}
                        aria-label="Rolar para esquerda"
                    />
                    <Button
                        icon="pi pi-chevron-right"
                        className="p-button-rounded p-button-text"
                        onClick={() => scroll("right")}
                        style={{ color: "#9ca3af" }}
                        aria-label="Rolar para direita"
                    />
                </div>
            </div>

            {/* Carrossel */}
            <div
                ref={scrollContainerRef}
                style={{
                    display: "flex",
                    gap: "16px",
                    overflowX: "auto",
                    paddingBottom: "12px",
                    scrollBehavior: "smooth",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#4b5563 #1f2937",
                }}
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onView={() => navigate(`/productsdetail/${product.id}`)}
                        onAddToCart={() => handleAddToCart(product)}
                    />
                ))}
            </div>
        </div>
    );
};
