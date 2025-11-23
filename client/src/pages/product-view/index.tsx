import {useEffect, useState} from "react";
import type { IProduct } from "@/commons/types.ts";
import ProductService from "@/services/product-service.ts";
import {ProductCard} from "@/components/product-card";

export const ProductView = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const { findAll }  = ProductService;
    useEffect(() => {
        loadData();
    }, [])
    const loadData = async () => {
        const response = await findAll();
        if (response.status === 200) {
            setProducts(Array.isArray(response.data) ? response.data: []);
        }
    }
    return (
        <div className="container mx-auto px-4 pt-24">
            {products.map((product) => (
                <ProductCard product={product} />
            ))}
        </div>
    )
}