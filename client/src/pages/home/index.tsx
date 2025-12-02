// ✅ HOME PAGE CORRIGIDA: pages/home/index.tsx
import React from "react";
import { BannerGrid } from "@/components/banner-grid";
import { Carrossel } from "@/components/carrosel-produtos";

export const HomePage: React.FC = () => {
    return (
        <main className="min-h-screen bg-gray-900">
            {/* Banner Grid com margem inferior */}
            <div className="mb-12">
                <BannerGrid />
            </div>

            {/* Container principal com padding e espaçamento consistente */}
            <div className="container mx-auto px-4 pb-10">
                {/* Seção Drones com margem superior e inferior */}
                <section className="mb-16 mt-8">
                    <Carrossel
                        categoryId={1}
                        title="Drones em Destaque"
                    />
                </section>

                {/* Seção Smartwatches com margem entre seções */}
                <section className="mb-16">
                    <Carrossel
                        categoryId={2}
                        title="Smartwatches"
                    />
                </section>

                {/* Seção Fones */}
                <section className="mb-16">
                    <Carrossel
                        categoryId={3}
                        title="Fones de Ouvido"
                    />
                </section>

                {/* Seção Smartphones */}
                <section className="mb-16">
                    <Carrossel
                        categoryId={4}
                        title="Smartphones"
                    />
                </section>
            </div>
        </main>
    );
};