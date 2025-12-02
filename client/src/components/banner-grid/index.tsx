import React from "react";
import imagemAll from "@/imagens/imagem_all.png";
import destaquesI from "@/imagens/Destaques.png";

export const BannerGrid: React.FC = () => {
    return (
        <section className="container mx-auto px-4 mt-6 space-y-6">

            {/* Imagens superiores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Banner principal */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
                    <img
                        src={imagemAll}
                        alt="Promoções especiais"
                        className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all"
                    />
                    <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/70 to-transparent w-full">
                        <h2 className="text-white text-3xl md:text-4xl font-semibold drop-shadow">
                            Promoções Exclusivas
                        </h2>
                    </div>
                </div>

            </div>

            {/* Imagem inferior */}
            <div className="relative h-56 md:h-72 w-full rounded-2xl overflow-hidden shadow-xl shadow-black/30">
                <img
                    src={destaquesI}
                    alt="Produtos em destaque"
                    className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all"
                />
            </div>

        </section>
    );
};
