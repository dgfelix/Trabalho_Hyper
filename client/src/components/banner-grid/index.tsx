import React from "react";

const BANNER_TOP    = "/imagens/imagem_all.png";
const BANNER_BOTTOM = "/imagens/Destaques.png";

export const BannerGrid: React.FC = () => {
    return (
        <section className="container mx-auto px-4 mt-6" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

            {/* Imagem superior */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/30" style={{ height: "320px" }}>
                <img
                    src={BANNER_TOP}
                    alt="Promoções especiais"
                    className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all"
                />
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/70 to-transparent w-full">
                    <h2 className="text-white text-3xl font-semibold drop-shadow">
                        Promoções Exclusivas
                    </h2>
                </div>
            </div>

            {/* Imagem inferior */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-black/30" style={{ height: "220px" }}>
                <img
                    src={BANNER_BOTTOM}
                    alt="Produtos em destaque"
                    className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all"
                />
            </div>

        </section>
    );
};
