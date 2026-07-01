/**
 * Mapeamento dos produtos do import.sql para imagens em public/imagens/.
 * Centralizado aqui para evitar duplicação entre o carrossel e a página de detalhe.
 */
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
    "Smartphone XYZ":         "/imagens/Smart1.jpg",
    "TV LCD 75pol":           "/imagens/Smartwatch3.png",
    "Notebook Arus 15.6":     "/imagens/drone1.png",
    "Monitor 27pol":          "/imagens/drone2.png",
    "Roteador Wi-Fi 5.4GhZ":  "/imagens/drone3.png",
    "Kit Teclado e Mouse":    "/imagens/Fones1.png",
    "Fogão 6 Bocas":          "/imagens/Fones3.png",
    "Refrigerador 429L":      "/imagens/Smartwatch1.png",
};

const SVG_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%234b5563'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ESem imagem%3C/text%3E%3C/svg%3E";

/**
 * Resolve o caminho da imagem de um produto.
 * Prioridade: imagePath da API → mapeamento por nome → placeholder.
 */
export function resolveProductImage(imagePath?: string | null, productName?: string): string {
    if (imagePath) return `/imagens/${imagePath.trim()}`;
    if (productName && PRODUCT_IMAGE_MAP[productName]) return PRODUCT_IMAGE_MAP[productName];
    return SVG_PLACEHOLDER;
}
