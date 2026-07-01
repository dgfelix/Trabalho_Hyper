import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import ProductService from "@/services/product-service.ts";
import type { IProduct } from "@/commons/types.ts";
import { resolveProductImage } from "@/lib/product-image";
import { useCart } from "@/context/hooks/use-cart";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatPrice = (price: number): string =>
    price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const calcInstallment = (price: number, n = 5): string =>
    (price / n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const calcPixPrice = (price: number, discount = 0.05): string =>
    (price * (1 - discount)).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = React.useRef<Toast>(null);

    const { addItem } = useCart();

    const [product, setProduct]   = useState<IProduct | null>(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // -----------------------------------------------------------------------
    // Carregamento do produto
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (!id) { setError("ID do produto não encontrado"); setLoading(false); return; }

        const load = async () => {
            try {
                setLoading(true);
                const response = await ProductService.findById(Number(id));
                if (response.success && response.data) {
                    setProduct(response.data as IProduct);
                } else {
                    setError(response.message || "Produto não encontrado");
                }
            } catch {
                setError("Não foi possível carregar o produto");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    // -----------------------------------------------------------------------
    // Ações
    // -----------------------------------------------------------------------
    const handleAddToCart = () => {
        if (!product) return;
        addItem(product, quantity);
        toast.current?.show({
            severity: "success",
            summary: "Adicionado ao carrinho",
            detail: `${quantity}x ${product.name}`,
            life: 3000,
        });
    };

    const handleBuyNow = () => {
        if (!product) return;
        addItem(product, quantity);
        navigate("/cart");
    };

    // -----------------------------------------------------------------------
    // Estados de loading / erro
    // -----------------------------------------------------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-900 pt-24 px-4">
                <div className="max-w-2xl mx-auto text-center p-8 bg-gray-800 rounded-lg border border-red-800">
                    <i className="pi pi-exclamation-triangle text-red-400 text-4xl mb-4" />
                    <p className="text-red-400 text-xl mb-6">{error || "Produto não encontrado"}</p>
                    <Button label="Voltar" icon="pi pi-arrow-left" className="p-button-outlined" onClick={() => navigate(-1)} />
                </div>
            </div>
        );
    }

    const imageSrc = resolveProductImage(product.imagePath, product.name);

    // -----------------------------------------------------------------------
    // Render principal
    // -----------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-gray-900 pb-16">
            <Toast ref={toast} />

            <div className="max-w-6xl mx-auto px-6 pt-8">

                {/* Breadcrumb / Voltar */}
                <div className="mb-8">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        className="p-button-text"
                        style={{ color: "#9ca3af" }}
                        onClick={() => navigate(-1)}
                    />
                </div>

                {/* Layout principal: imagem à esquerda, info à direita */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

                    {/* ── Coluna esquerda: imagem ── */}
                    <div>
                        {/* Imagem principal */}
                        <div
                            style={{
                                background: "#1f2937",
                                borderRadius: "16px",
                                overflow: "hidden",
                                height: "420px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid #374151",
                            }}
                        >
                            <img
                                src={imageSrc}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>

                        {/* Grid de benefícios */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
                            {[
                                { icon: "pi-credit-card", color: "#4ade80", label: "Parcelamento",   sub: "em até 12x sem juros" },
                                { icon: "pi-truck",       color: "#60a5fa", label: "Frete grátis",   sub: "acima de R$ 299" },
                                { icon: "pi-qrcode",      color: "#fbbf24", label: "Pix",            sub: "5% de desconto" },
                                { icon: "pi-shield",      color: "#c084fc", label: "Garantia",       sub: "12 meses" },
                            ].map(({ icon, color, label, sub }) => (
                                <div
                                    key={label}
                                    style={{
                                        background: "#1f2937",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        textAlign: "center",
                                        border: "1px solid #374151",
                                    }}
                                >
                                    <i className={`pi ${icon} text-2xl mb-2`} style={{ color, display: "block" }} />
                                    <p style={{ color: "#d1d5db", fontSize: "13px", fontWeight: 500, marginBottom: "2px" }}>{label}</p>
                                    <p style={{ color: "#6b7280", fontSize: "11px" }}>{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Coluna direita: informações ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

                        {/* Badge de estoque */}
                        <div style={{ marginBottom: "12px" }}>
                            <span style={{
                                background: "#14532d",
                                color: "#4ade80",
                                fontSize: "12px",
                                fontWeight: 600,
                                padding: "4px 12px",
                                borderRadius: "999px",
                                border: "1px solid #166534",
                            }}>
                                ● Em estoque
                            </span>
                        </div>

                        {/* Categoria */}
                        <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "8px" }}>
                            {product.category?.name || "Sem categoria"}
                        </p>

                        {/* Nome do produto */}
                        <h1 style={{ color: "#f3f4f6", fontSize: "26px", fontWeight: 700, lineHeight: 1.3, marginBottom: "24px" }}>
                            {product.name}
                        </h1>

                        <Divider style={{ margin: "0 0 20px 0", borderColor: "#374151" }} />

                        {/* Preços */}
                        <div style={{ marginBottom: "24px" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                                <span style={{ color: "#9ca3af", fontSize: "13px", textDecoration: "line-through" }}>
                                    R$ {formatPrice(product.price)}
                                </span>
                                <span style={{ color: "#4ade80", fontSize: "13px", fontWeight: 500 }}>5% OFF no Pix</span>
                            </div>
                            <div style={{ marginBottom: "6px" }}>
                                <span style={{ color: "#f3f4f6", fontSize: "36px", fontWeight: 800 }}>
                                    R$ {calcPixPrice(product.price)}
                                </span>
                            </div>
                            <p style={{ color: "#9ca3af", fontSize: "13px" }}>
                                à vista no Pix
                            </p>
                            <p style={{ color: "#d1d5db", fontSize: "14px", marginTop: "4px" }}>
                                ou <strong>R$ {formatPrice(product.price)}</strong> em até{" "}
                                <strong>5x de R$ {calcInstallment(product.price)}</strong> sem juros
                            </p>
                        </div>

                        <Divider style={{ margin: "0 0 20px 0", borderColor: "#374151" }} />

                        {/* Quantidade */}
                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ color: "#d1d5db", fontSize: "14px", fontWeight: 500, marginBottom: "12px" }}>
                                Quantidade
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <Button
                                    icon="pi pi-minus"
                                    className="p-button-rounded p-button-outlined p-button-sm"
                                    style={{ width: "36px", height: "36px" }}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                />
                                <span style={{ color: "#f3f4f6", fontSize: "20px", fontWeight: 700, minWidth: "32px", textAlign: "center" }}>
                                    {quantity}
                                </span>
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-outlined p-button-sm"
                                    style={{ width: "36px", height: "36px" }}
                                    onClick={() => setQuantity(quantity + 1)}
                                />
                            </div>
                        </div>

                        {/* Botões de ação */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                            <Button
                                label="COMPRAR AGORA"
                                icon="pi pi-shopping-cart"
                                className="w-full"
                                style={{
                                    background: "#ea580c",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: 700,
                                    padding: "14px 24px",
                                    borderRadius: "10px",
                                }}
                                onClick={handleBuyNow}
                            />
                            <Button
                                label="Adicionar ao Carrinho"
                                icon="pi pi-cart-plus"
                                className="w-full p-button-outlined"
                                style={{
                                    fontSize: "15px",
                                    padding: "12px 24px",
                                    borderRadius: "10px",
                                    borderColor: "#3b82f6",
                                    color: "#3b82f6",
                                }}
                                onClick={handleAddToCart}
                            />
                        </div>

                        {/* Descrição */}
                        <div style={{
                            background: "#1f2937",
                            borderRadius: "12px",
                            padding: "20px 24px",
                            border: "1px solid #374151",
                        }}>
                            <h3 style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 600, marginBottom: "10px" }}>
                                Descrição
                            </h3>
                            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.7 }}>
                                {product.description || "Sem descrição disponível."}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
