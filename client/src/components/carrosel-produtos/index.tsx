import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import ProductService from "@/services/product-service";
import type { IProduct } from "@/commons/types";
import { resolveProductImage } from "@/lib/product-image";

const SVG_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234b5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3ESem imagem%3C/text%3E%3C/svg%3E";

interface CarrosselProps {
    categoryId: number;
    title: string;
    /** Produtos pré-carregados. Se fornecido, não faz chamada à API. */
    products?: IProduct[];
}

export const Carrossel: React.FC<CarrosselProps> = ({ categoryId, title, products: productsProp }) => {
    const [products, setProducts] = useState<IProduct[]>(productsProp ?? []);
    const [loading, setLoading] = useState(!productsProp);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const MAX_PRODUCTS_DISPLAY = 5;
    const SCROLL_AMOUNT = 300;

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
        // Se os produtos vieram via prop, não busca da API
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

    const handleProductClick = useCallback((productId?: number) => {
        if (!productId) return;
        navigate(`/productsdetail/${productId}`);
    }, [navigate]);

    const handleAddToCart = useCallback((e: React.MouseEvent, productId?: number) => {
        e.stopPropagation();
        if (!productId) return;
        console.log("Adicionar ao carrinho - Produto ID:", productId);
    }, []);

    const getImagePath = useCallback((product: IProduct): string => {
        return resolveProductImage(product.imagePath, product.name);
    }, []);

    const formatPrice = useCallback((price: number): string => {
        return price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, []);

    const truncateName = useCallback((name: string, maxLength = 60): string => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    }, []);

    if (loading) {
        return (
            <div className="w-full my-12 px-4">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">{title}</h2>
                <div className="flex justify-center items-center h-64">
                    <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full my-12 px-4">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">{title}</h2>
                <div className="text-center text-red-400 p-8 bg-gray-800 rounded-lg border border-red-800">
                    <i className="pi pi-exclamation-triangle text-4xl mb-3" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="w-full my-12 px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-chevron-left"
                        className="p-button-rounded p-button-text hover:bg-gray-700"
                        onClick={() => scroll("left")}
                        style={{ color: "#9ca3af" }}
                        aria-label="Rolar para esquerda"
                    />
                    <Button
                        icon="pi pi-chevron-right"
                        className="p-button-rounded p-button-text hover:bg-gray-700"
                        onClick={() => scroll("right")}
                        style={{ color: "#9ca3af" }}
                        aria-label="Rolar para direita"
                    />
                </div>
            </div>

            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#4b5563 #1f2937" }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{ width: "220px", flexShrink: 0 }}
                            className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300 border border-gray-700 hover:border-blue-500 overflow-hidden"
                            onClick={() => handleProductClick(product.id)}
                        >
                            {/* Imagem com tamanho fixo e object-cover para sem distorção */}
                            <div style={{ width: "220px", height: "180px", flexShrink: 0 }}>
                                <img
                                    src={getImagePath(product)}
                                    alt={product.name}
                                    style={{ width: "220px", height: "180px", objectFit: "cover", display: "block" }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = SVG_PLACEHOLDER;
                                    }}
                                    loading="lazy"
                                />
                            </div>

                            {/* Informações do produto */}
                            <div className="p-4">
                                <div style={{ height: "48px", overflow: "hidden", marginBottom: "12px" }}>
                                    <h3
                                        className="text-gray-100 font-medium text-sm leading-tight"
                                        style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                                        title={product.name}
                                    >
                                        {product.name}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between" style={{ borderTop: "1px solid #374151", paddingTop: "10px" }}>
                                    <span className="text-blue-400 font-bold text-lg">
                                        R$ {formatPrice(product.price)}
                                    </span>
                                    <Button
                                        icon="pi pi-shopping-cart"
                                        className="p-button-rounded p-button-sm"
                                        style={{ background: "#3b82f6", border: "none", width: "34px", height: "34px" }}
                                        onClick={(e) => handleAddToCart(e, product.id)}
                                        tooltip="Adicionar ao carrinho"
                                        tooltipOptions={{ position: "top" }}
                                        aria-label={`Adicionar ${product.name} ao carrinho`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
