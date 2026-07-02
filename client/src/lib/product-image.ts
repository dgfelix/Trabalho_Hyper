/**
 * Fallback: mapeia nome do produto → imagem caso imagePath não venha da API.
 * Com o campo image_path já no backend, a API devolve imagePath direto
 * e este mapa raramente é acionado.
 */
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
    // Drones
    "Drone DJI Mavic 3 Pro":         "/imagens/drone1.png",
    "Drone Autel Robotics EVO II":    "/imagens/drone2.png",
    "Drone Parrot Anafi":             "/imagens/drone3.png",
    "Drone Holy Stone HS720":         "/imagens/drone4.png",
    "Drone Xiaomi FIMI X8SE":         "/imagens/drone1.png",
    // Smartwatches
    "Smartwatch Apple Watch Series 8":    "/imagens/Smartwatch1.png",
    "Smartwatch Samsung Galaxy Watch 5":  "/imagens/Smarwatch2.png",
    "Smartwatch Garmin Fenix 6":          "/imagens/Smartwatch4.png",
    "Smartwatch Xiaomi Mi Band 7":        "/imagens/Smartwatch3.png",
    "Smartwatch Huawei Watch GT 3":       "/imagens/Smartwatch5.png",
    // Fones de Ouvido
    "Fone de Ouvido Sony WH-1000XM5":              "/imagens/Fones1.png",
    "Fone de Ouvido Bose QuietComfort 45":          "/imagens/Fones2.png",
    "Fone de Ouvido JBL Tune 510BT":                "/imagens/Fones3.png",
    "Fone de Ouvido Apple AirPods Pro (2ª Geração)":"/imagens/Fones4.png",
    "Fone de Ouvido Xiaomi Redmi Buds 3 Pro":       "/imagens/Fones5.png",
    // Smartphones
    "Smartphone Samsung Galaxy S23 Ultra": "/imagens/Smart1.jpg",
    "Smartphone iPhone 15 Pro Max":        "/imagens/Smart2.jpg",
    "Smartphone Xiaomi 13 Pro":            "/imagens/Smart3.jpg",
    "Smartphone Motorola Edge 40":         "/imagens/Smart4.jpg",
    "Smartphone Google Pixel 7 Pro":       "/imagens/Smart5.jpg",
};

const SVG_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%234b5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ESem imagem%3C/text%3E%3C/svg%3E";

/**
 * Resolve o caminho da imagem de um produto.
 * Prioridade: imagePath da API → mapeamento por nome → placeholder SVG.
 */
export function resolveProductImage(imagePath?: string | null, productName?: string): string {
    if (imagePath) return `/imagens/${imagePath.trim()}`;
    if (productName && PRODUCT_IMAGE_MAP[productName]) return PRODUCT_IMAGE_MAP[productName];
    return SVG_PLACEHOLDER;
}
