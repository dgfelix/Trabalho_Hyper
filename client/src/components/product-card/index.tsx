
import { Card } from "primereact/card";
import type {IProduct} from "@/commons/types.ts";
import {Button} from "primereact/button";
import {ProductCardText} from "@/components/product-card-text";

interface IProductCardProps {
    product: IProduct;
}

export const ProductCard = ({ product } : IProductCardProps) => {

    return (
        <div className="p-col-12 p-sm-6 p-md-4 p-lg-3 mb-4">
            <Card
                title={product.name}
                subTitle={product.price}
                header={
                    <img
                        alt={product.name}
                        src="https://primefaces.org/cdn/primereact/images/usercard.png"
                        style={{width: "100%", height: "200px", objectFit: "cover"}}
                    />
                }
                footer={
                    <div>
                        <Button
                            label="Comprar"
                            icon="pi pi-shopping-cart"
                            className="p-button-sm p-mr-2"
                        />
                        <Button
                            label="Detalhes"
                            icon="pi pi-circle"
                            className="p-button-secondary p-button-sm"
                        />
                    </div>
                }
            >
                <ProductCardText text={product.description} />
            </Card>
        </div>
    )
}