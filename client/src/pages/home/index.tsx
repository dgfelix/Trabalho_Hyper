import React, { useEffect, useState } from "react";
import { BannerGrid } from "@/components/banner-grid";
import { Carrossel } from "@/components/carrosel-produtos";
import type { ICategory, IProduct } from "@/commons/types";
import CategoryService from "@/services/category-service";
import ProductService from "@/services/product-service";
import { ProgressSpinner } from "primereact/progressspinner";

export const HomePage: React.FC = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [productsByCategory, setProductsByCategory] = useState<Record<number, IProduct[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Uma única chamada para cada recurso — sem N chamadas por categoria
                const [catResponse, prodResponse] = await Promise.all([
                    CategoryService.findAll(),
                    ProductService.findAll(),
                ]);

                const cats: ICategory[] = catResponse.success && Array.isArray(catResponse.data)
                    ? (catResponse.data as ICategory[])
                    : [];

                const allProducts: IProduct[] = prodResponse.success && Array.isArray(prodResponse.data)
                    ? (prodResponse.data as IProduct[])
                    : [];

                // Agrupa produtos por categoryId no cliente
                const grouped: Record<number, IProduct[]> = {};
                for (const product of allProducts) {
                    const catId = product.category?.id;
                    if (catId == null) continue;
                    if (!grouped[catId]) grouped[catId] = [];
                    grouped[catId].push(product);
                }

                setCategories(cats);
                setProductsByCategory(grouped);
            } catch {
                // Banner continua visível mesmo sem dados
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <main className="min-h-screen bg-gray-900">
            <div className="mb-8">
                <BannerGrid />
            </div>

            <div className="container mx-auto px-4 pb-10">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
                    </div>
                ) : (
                    categories.map((category) => (
                        <section key={category.id} className="mb-16 mt-8">
                            <Carrossel
                                categoryId={category.id!}
                                title={category.name}
                                products={productsByCategory[category.id!] ?? []}
                            />
                        </section>
                    ))
                )}
            </div>
        </main>
    );
};
