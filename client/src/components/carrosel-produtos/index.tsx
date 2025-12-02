import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import ProductService from "@/services/product-service";
import type { IProduct } from "@/commons/types";

interface CarrosselProps {
    categoryId: number;
    categoryName: string;
    title: string;
}

export const Carrossel: React.FC<CarrosselProps> = ({
                                                        categoryId,
                                                        categoryName,
                                                        title,
                                                    }) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Constantes
    const MAX_PRODUCTS_DISPLAY = 5;
    const SCROLL_AMOUNT = 300;

    // useCallback para evitar re-render infinito
    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await ProductService.findByCategory(categoryId);

            if (response.success && response.data) {
                const limitedProducts = Array.isArray(response.data)
                    ? response.data.slice(0, MAX_PRODUCTS_DISPLAY)
                    : [];
                setProducts(limitedProducts);
            } else {
                setError(response.message || "Erro ao carregar produtos");
            }
        } catch (err) {
            setError("Não foi possível carregar os produtos");
            console.error("Erro ao carregar produtos:", err);
        } finally {
            setLoading(false);
        }
    }, [categoryId]); // Só recria a função quando categoryId mudar

    // useEffect com dependência correta
    useEffect(() => {
        loadProducts();
    }, [loadProducts]); // Depende de loadProducts (que só muda quando categoryId muda)

    const scroll = useCallback((direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const targetScroll =
            direction === "left"
                ? container.scrollLeft - SCROLL_AMOUNT
                : container.scrollLeft + SCROLL_AMOUNT;

        container.scrollTo({
            left: targetScroll,
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
        // TODO: Implementar lógica de adicionar ao carrinho
        console.log("Adicionar ao carrinho - Produto ID:", productId);
    }, []);

    // Função para pegar o caminho correto da imagem
    const getImagePath = useCallback((product: IProduct): string => {
        if (product.imagePath) {
            const cleanPath = product.imagePath.trim();
            return `/imagens/${cleanPath}`;
        }
        // ✅ Fallback seguro sem dependência de arquivo
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234b5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3ESem imagem%3C/text%3E%3C/svg%3E";
    }, []);

    const formatPrice = useCallback((price: number): string => {
        return price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, []);

    const truncateName = useCallback((name: string, maxLength: number = 60): string => {
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="w-full my-12 px-4">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                    {categoryName}
                </h2>
                <div className="flex justify-center items-center h-64">
                    <ProgressSpinner
                        style={{ width: "50px", height: "50px" }}
                        strokeWidth="4"
                    />
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="w-full my-12 px-4">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                    {categoryName}
                </h2>
                <div className="text-center text-red-400 p-8 bg-gray-800 rounded-lg border border-red-800">
                    <i className="pi pi-exclamation-triangle text-4xl mb-3" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Empty State
    if (products.length === 0) {
        return (
            <div className="w-full my-12 px-4">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                    {categoryName}
                </h2>
                <div className="text-center text-gray-400 p-8 bg-gray-800 rounded-lg border border-gray-700">
                    <i className="pi pi-inbox text-4xl mb-3" />
                    <p>Nenhum produto encontrado nesta categoria</p>
                </div>
            </div>
        );
    }

    // Main Carousel
    return (
        <div className="w-full my-12 px-4">
            {/* Header com título e botões de navegação */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">{categoryName}</h2>

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

            {/* Container do carrossel */}
            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#4b5563 #1f2937",
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[260px] bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 border border-gray-700 hover:border-blue-500"
                            onClick={() => handleProductClick(product.id)}
                        >
                            {/* Container da imagem - tamanho fixo */}
                            <div className="w-full h-[200px] bg-gray-700 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                                <img
                                    src={getImagePath(product)}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234b5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%239ca3af'%3ESem imagem%3C/text%3E%3C/svg%3E";
                                    }}
                                    loading="lazy"
                                />
                            </div>

                            {/* Nome do produto - altura fixa para padronização */}
                            <div className="h-[60px] mb-3">
                                <h3
                                    className="text-gray-100 font-medium text-sm leading-tight line-clamp-3"
                                    title={product.name}
                                >
                                    {truncateName(product.name)}
                                </h3>
                            </div>

                            {/* Seção de preço e botão - altura fixa */}
                            <div className="flex items-center justify-between h-[40px] border-t border-gray-700 pt-3">
                                <div className="flex flex-col">
                  <span className="text-blue-400 font-bold text-xl">
                    R$ {formatPrice(product.price)}
                  </span>
                                </div>

                                <Button
                                    icon="pi pi-shopping-cart"
                                    className="p-button-rounded p-button-sm"
                                    style={{
                                        background: "#3b82f6",
                                        border: "none",
                                        width: "36px",
                                        height: "36px",
                                    }}
                                    onClick={(e) => handleAddToCart(e, product.id)}
                                    tooltip="Adicionar ao carrinho"
                                    tooltipOptions={{ position: "top" }}
                                    aria-label={`Adicionar ${product.name} ao carrinho`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};