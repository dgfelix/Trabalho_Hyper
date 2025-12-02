import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import ProductService from "@/services/product-service.ts";
import type { IProduct } from "@/commons/types.ts";

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const toast = React.useRef<Toast>(null);

    useEffect(() => {
        loadProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadProduct = async () => {
        if (!id) {
            setError("ID do produto não encontrado");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await ProductService.findById(Number(id));

            if (response.success && response.data) {
                const productData = response.data as IProduct;
                setProduct(productData);

                // Define imagem principal
                if (productData.imagePath) {
                    setSelectedImage(`/imagens/${productData.imagePath}`);
                }
            } else {
                setError(response.message || "Produto não encontrado");
            }
        } catch (err) {
            setError("Não foi possível carregar o produto");
            console.error("Erro ao carregar produto:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        // TODO: Implementar lógica real de adicionar ao carrinho
        console.log("Adicionar ao carrinho:", {
            productId: product.id,
            quantity,
        });

        toast.current?.show({
            severity: "success",
            summary: "Produto adicionado!",
            detail: `${product.name} foi adicionado ao carrinho`,
            life: 3000,
        });
    };

    const handleBuyNow = () => {
        if (!product) return;

        // TODO: Implementar lógica de compra direta
        handleAddToCart();
        navigate("/checkout");
    };

    const formatPrice = (price: number): string => {
        return price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const calculateInstallment = (price: number, installments: number = 5): string => {
        const installmentValue = price / installments;
        return installmentValue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
                <ProgressSpinner
                    style={{ width: "50px", height: "50px" }}
                    strokeWidth="4"
                />
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-900 pt-24 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center text-red-400 p-8 bg-gray-800 rounded-lg border border-red-800">
                        <i className="pi pi-exclamation-triangle text-4xl mb-3" />
                        <p className="text-xl mb-4">{error || "Produto não encontrado"}</p>
                        <Button
                            label="Voltar para Home"
                            icon="pi pi-arrow-left"
                            onClick={() => navigate("/home")}
                            className="p-button-outlined"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Main Content
    return (
        <div className="min-h-screen bg-gray-900 pt-24 pb-12">
            <Toast ref={toast} />

            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        className="p-button-text text-gray-400"
                        onClick={() => navigate(-1)}
                    />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Coluna Esquerda - Imagens */}
                    <div className="space-y-4">
                        {/* Imagem Principal */}
                        <div className="bg-white rounded-2xl p-8 flex items-center justify-center h-[500px]">
                            <img
                                src={selectedImage || "/imagens/placeholder.png"}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/imagens/placeholder.png";
                                }}
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 justify-center">
                            <div
                                className={`w-20 h-20 bg-white rounded-lg cursor-pointer border-2 ${
                                    selectedImage === `/imagens/${product.imagePath}`
                                        ? "border-blue-500"
                                        : "border-gray-300"
                                } hover:border-blue-400 transition-colors p-2`}
                                onClick={() =>
                                    product.imagePath &&
                                    setSelectedImage(`/imagens/${product.imagePath}`)
                                }
                            >
                                <img
                                    src={`/imagens/${product.imagePath}`}
                                    alt="Thumbnail 1"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/imagens/placeholder.png";
                                    }}
                                />
                            </div>
                            {/* Pode adicionar mais thumbnails aqui */}
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                                <i className="pi pi-credit-card text-green-400 text-2xl mb-2" />
                                <p className="text-gray-300 text-sm">Parcelamento</p>
                                <p className="text-gray-400 text-xs">em até 12x</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                                <i className="pi pi-truck text-blue-400 text-2xl mb-2" />
                                <p className="text-gray-300 text-sm">Entrega</p>
                                <p className="text-gray-400 text-xs">fora do Brasil</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                                <i className="pi pi-dollar text-yellow-400 text-2xl mb-2" />
                                <p className="text-gray-300 text-sm">Cartão e Pix</p>
                                <p className="text-gray-400 text-xs">aceitos</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                                <i className="pi pi-shield text-purple-400 text-2xl mb-2" />
                                <p className="text-gray-300 text-sm">Preço não</p>
                                <p className="text-gray-400 text-xs">inclui valor</p>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita - Informações */}
                    <div className="space-y-6">
                        {/* Badge de Estoque */}
                        <Badge value="Em estoque" severity="success" />

                        {/* Título */}
                        <h1 className="text-3xl font-bold text-gray-100 leading-tight">
                            {product.name}
                        </h1>

                        {/* Preço */}
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-green-400">
                  R$ {formatPrice(product.price)}
                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                à vista no pix
                            </p>
                            <p className="text-gray-300 text-sm">
                                ou até 5x de <span className="font-semibold">R$ {calculateInstallment(product.price)}</span>
                            </p>
                        </div>

                        {/* Quantidade */}
                        <div className="space-y-2">
                            <label className="text-gray-300 font-medium">Quantidade</label>
                            <div className="flex items-center gap-4">
                                <Button
                                    icon="pi pi-minus"
                                    className="p-button-rounded p-button-outlined"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                />
                                <span className="text-2xl font-bold text-gray-100 w-12 text-center">
                  {quantity}
                </span>
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-outlined"
                                    onClick={() => setQuantity(quantity + 1)}
                                />
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="space-y-3">
                            <Button
                                label="COMPRAR"
                                icon="pi pi-shopping-cart"
                                className="w-full p-button-lg font-bold"
                                style={{
                                    background: "#ff6600",
                                    border: "none",
                                    fontSize: "18px",
                                    padding: "16px",
                                }}
                                onClick={handleBuyNow}
                            />
                            <Button
                                label="Adicionar ao Carrinho"
                                icon="pi pi-cart-plus"
                                className="w-full p-button-lg p-button-outlined"
                                onClick={handleAddToCart}
                            />
                        </div>

                        {/* Categoria */}
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <p className="text-gray-400 text-sm mb-1">Categoria</p>
                            <p className="text-gray-100 font-semibold">
                                {product.category?.name || "Sem categoria"}
                            </p>
                        </div>

                        {/* Descrição */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-gray-100 mb-4">
                                Descrição
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {product.description || "Sem descrição disponível."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};