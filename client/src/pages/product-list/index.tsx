import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { useCart } from "@/context/hooks/use-cart";
import { resolveProductImage } from "@/lib/product-image";
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import type { ICategory, IProduct } from "@/commons/types";

const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ProductListPage = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const { authenticated } = useAuth();
    const { addItem } = useCart();

    const [products, setProducts]         = useState<IProduct[]>([]);
    const [categories, setCategories]     = useState<ICategory[]>([]);
    const [activeCatId, setActiveCatId]   = useState<number | null>(null);
    const [loading, setLoading]           = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                ProductService.findAll(),
                CategoryService.findAll(),
            ]);
            if (prodRes.success && Array.isArray(prodRes.data)) setProducts(prodRes.data as IProduct[]);
            if (catRes.success  && Array.isArray(catRes.data))  setCategories(catRes.data as ICategory[]);
            setLoading(false);
        };
        load();
    }, []);

    const filtered = activeCatId
        ? products.filter((p) => p.category?.id === activeCatId)
        : products;

    const handleAddToCart = (product: IProduct) => {
        addItem(product, 1);
        toast.current?.show({
            severity: "success",
            summary: "Adicionado",
            detail: `${product.name} adicionado ao carrinho.`,
            life: 2000,
        });
    };

    return (
        <div style={{ background: "#111827", minHeight: "100vh", paddingTop: "80px", paddingBottom: "64px" }}>
            <Toast ref={toast} />

            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>

                {/* Cabeçalho */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                        <h1 style={{ color: "#f3f4f6", fontSize: "26px", fontWeight: 700, margin: 0 }}>
                            <i className="pi pi-tags" style={{ marginRight: "10px", color: "#3b82f6" }} />
                            Produtos
                        </h1>
                        <p style={{ color: "#6b7280", fontSize: "13px", margin: "4px 0 0" }}>
                            {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
                        </p>
                    </div>

                </div>

                {/* Filtro por categoria */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                    <button
                        onClick={() => setActiveCatId(null)}
                        style={{
                            padding: "7px 18px",
                            borderRadius: "999px",
                            border: "1px solid",
                            borderColor: activeCatId === null ? "#3b82f6" : "#374151",
                            background: activeCatId === null ? "#1e3a5f" : "#1f2937",
                            color: activeCatId === null ? "#60a5fa" : "#9ca3af",
                            fontSize: "13px",
                            fontWeight: activeCatId === null ? 700 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                    >
                        Todos
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCatId(cat.id ?? null)}
                            style={{
                                padding: "7px 18px",
                                borderRadius: "999px",
                                border: "1px solid",
                                borderColor: activeCatId === cat.id ? "#3b82f6" : "#374151",
                                background: activeCatId === cat.id ? "#1e3a5f" : "#1f2937",
                                color: activeCatId === cat.id ? "#60a5fa" : "#9ca3af",
                                fontSize: "13px",
                                fontWeight: activeCatId === cat.id ? 700 : 400,
                                cursor: "pointer",
                                transition: "all 0.15s",
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Conteúdo */}
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                        <ProgressSpinner style={{ width: "48px", height: "48px" }} strokeWidth="4" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <i className="pi pi-inbox" style={{ fontSize: "48px", color: "#4b5563", marginBottom: "16px", display: "block" }} />
                        <p style={{ color: "#6b7280", fontSize: "16px" }}>Nenhum produto encontrado nesta categoria.</p>
                        <Button
                            label="Ver todos"
                            className="p-button-text p-button-sm"
                            style={{ color: "#3b82f6", marginTop: "8px" }}
                            onClick={() => setActiveCatId(null)}
                        />
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "20px",
                    }}>
                        {filtered.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                authenticated={authenticated}
                                onView={() => navigate(`/productsdetail/${product.id}`)}
                                onEdit={() => navigate(`/products/${product.id}`)}
                                onAddToCart={() => handleAddToCart(product)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Card de produto ──────────────────────────────────────────────────────────

interface CardProps {
    product: IProduct;
    authenticated: boolean;
    onView: () => void;
    onEdit: () => void;
    onAddToCart: () => void;
}

const ProductCard = ({ product, authenticated, onView, onEdit, onAddToCart }: CardProps) => {
    const [hovered, setHovered] = useState(false);
    const pixPrice = product.price * 0.95;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
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
                style={{ width: "100%", height: "180px", background: "#111827", overflow: "hidden", flexShrink: 0 }}
                onClick={onView}
            >
                <img
                    src={resolveProductImage(product.imagePath, product.name)}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s", transform: hovered ? "scale(1.06)" : "scale(1)" }}
                />
            </div>

            {/* Corpo */}
            <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
                {/* Categoria */}
                <span style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#60a5fa",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
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
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {product.name}
                </p>

                {/* Preços */}
                <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                    <p style={{ color: "#6b7280", fontSize: "11px", textDecoration: "line-through", margin: "0 0 2px" }}>
                        {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                    <p style={{ color: "#4ade80", fontSize: "16px", fontWeight: 800, margin: "0 0 2px" }}>
                        {pixPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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

                    {authenticated && (
                        <button
                            onClick={onEdit}
                            title="Editar produto"
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
                            <i className="pi pi-pencil" style={{ fontSize: "13px" }} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
