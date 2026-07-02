import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { useCart } from "@/context/hooks/use-cart";
import { resolveProductImage } from "@/lib/product-image";
import FormasPgtoService from "@/services/formas-pgto-service";
import OrderService from "@/services/order-service";
import type { IAddress, IFormaPgto } from "@/commons/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PIX_DISCOUNT_RATE = 0.05;

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const PaymentPage: React.FC = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const toast     = useRef<Toast>(null);

    const { items, subtotal, clearCart } = useCart();

    // Endereço vindo do carrinho via router state
    const selectedAddress: IAddress | null = location.state?.selectedAddress ?? null;
    const selectedAddressId: number | null = location.state?.selectedAddressId ?? null;

    // Formas de pagamento
    const [formas, setFormas]               = useState<IFormaPgto[]>([]);
    const [loadingFormas, setLoadingFormas] = useState(true);
    const [formaSelecionada, setFormaSelecionada] = useState<string>("");

    // Estado do envio
    const [submitting, setSubmitting] = useState(false);

    // Redireciona se carrinho vazio ou sem endereço
    useEffect(() => {
        if (items.length === 0) {
            navigate("/cart", { replace: true });
            return;
        }
        if (!selectedAddressId) {
            toast.current?.show({
                severity: "warn",
                summary: "Atenção",
                detail: "Selecione um endereço no carrinho antes de prosseguir.",
                life: 3000,
            });
            setTimeout(() => navigate("/cart", { replace: true }), 2000);
        }
    }, []);

    // Carrega formas de pagamento
    useEffect(() => {
        const load = async () => {
            setLoadingFormas(true);
            try {
                const res = await FormasPgtoService.findAll();
                if (res.success && Array.isArray(res.data)) {
                    const lista = res.data as IFormaPgto[];
                    setFormas(lista);
                    if (lista.length > 0) setFormaSelecionada(lista[0].type);
                }
            } finally {
                setLoadingFormas(false);
            }
        };
        load();
    }, []);

    // ---------------------------------------------------------------------------
    // Cálculos
    // ---------------------------------------------------------------------------

    const isPix      = formaSelecionada === "PIX";
    const desconto   = isPix ? subtotal * PIX_DISCOUNT_RATE : 0;
    const totalFinal = subtotal - desconto;

    // ---------------------------------------------------------------------------
    // Submissão
    // ---------------------------------------------------------------------------

    const handleConfirm = async () => {
        if (!formaSelecionada) {
            toast.current?.show({ severity: "warn", summary: "Atenção", detail: "Selecione uma forma de pagamento.", life: 3000 });
            return;
        }
        if (!selectedAddressId) {
            toast.current?.show({ severity: "warn", summary: "Atenção", detail: "Endereço de entrega não informado. Volte ao carrinho.", life: 3000 });
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                formaPgto:  formaSelecionada,
                addressId:  selectedAddressId,
                desconto:   Number(desconto.toFixed(2)),
                itens: items.map((i) => ({
                    productId: i.product.id!,
                    quantity:  i.quantity,
                })),
            };

            const res = await OrderService.create(payload);
            if (res.success) {
                toast.current?.show({
                    severity: "success",
                    summary: "Pedido confirmado!",
                    detail: `Pedido #${(res.data as any)?.id} realizado com sucesso.`,
                    life: 4000,
                });
                clearCart();
                setTimeout(() => navigate("/", { replace: true }), 2000);
            } else {
                toast.current?.show({ severity: "error", summary: "Erro", detail: res.message || "Não foi possível finalizar o pedido.", life: 5000 });
            }
        } finally {
            setSubmitting(false);
        }
    };

    // ---------------------------------------------------------------------------
    // Ícone por forma de pagamento
    // ---------------------------------------------------------------------------

    const iconForTipo = (tipo: string) => {
        switch (tipo) {
            case "PIX":     return "pi pi-bolt";
            case "CREDITO": return "pi pi-credit-card";
            case "DEBITO":  return "pi pi-wallet";
            case "BOLETO":  return "pi pi-barcode";
            default:        return "pi pi-money-bill";
        }
    };

    const labelForTipo = (tipo: string) => {
        switch (tipo) {
            case "PIX":     return "PIX";
            case "CREDITO": return "Cartão de Crédito";
            case "DEBITO":  return "Cartão de Débito";
            case "BOLETO":  return "Boleto Bancário";
            default:        return tipo;
        }
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <div className="min-h-screen" style={{ background: "#111827", paddingTop: "80px", paddingBottom: "64px" }}>
            <Toast ref={toast} />

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

                {/* Cabeçalho */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                    <Button
                        icon="pi pi-arrow-left"
                        className="p-button-text p-button-sm"
                        style={{ color: "#6b7280" }}
                        onClick={() => navigate("/cart")}
                        tooltip="Voltar ao carrinho"
                    />
                    <div>
                        <h1 style={{ color: "#f3f4f6", fontSize: "26px", fontWeight: 700, margin: 0 }}>
                            Finalizar Compra
                        </h1>
                        <p style={{ color: "#6b7280", fontSize: "13px", margin: "4px 0 0" }}>
                            Revise seu pedido e escolha a forma de pagamento
                        </p>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>

                    {/* ── Coluna esquerda: itens do pedido ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Itens */}
                        <div style={{ background: "#1f2937", borderRadius: "14px", border: "1px solid #374151", padding: "24px" }}>
                            <h2 style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>
                                <i className="pi pi-shopping-bag" style={{ marginRight: "8px", color: "#3b82f6" }} />
                                Itens do Pedido ({items.length})
                            </h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                {items.map(({ product, quantity }) => (
                                    <div
                                        key={product.id}
                                        style={{
                                            display: "flex",
                                            gap: "14px",
                                            alignItems: "center",
                                            padding: "12px",
                                            background: "#111827",
                                            borderRadius: "10px",
                                            border: "1px solid #374151",
                                        }}
                                    >
                                        <div style={{ width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#374151" }}>
                                            <img
                                                src={resolveProductImage(product.imagePath, product.name)}
                                                alt={product.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ color: "#9ca3af", fontSize: "11px", margin: "0 0 2px" }}>{product.category?.name}</p>
                                            <p style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: 600, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {product.name}
                                            </p>
                                            <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                                                {quantity}× R$ {fmt(product.price)}
                                            </p>
                                        </div>
                                        <p style={{ color: "#f3f4f6", fontSize: "15px", fontWeight: 700, flexShrink: 0, margin: 0 }}>
                                            R$ {fmt(product.price * quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Endereço de entrega */}
                        <div style={{ background: "#1f2937", borderRadius: "14px", border: "1px solid #374151", padding: "24px" }}>
                            <h2 style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
                                <i className="pi pi-map-marker" style={{ marginRight: "8px", color: "#3b82f6" }} />
                                Endereço de Entrega
                            </h2>

                            {selectedAddress ? (
                                <div style={{
                                    background: "#1e3a5f",
                                    border: "1px solid #3b82f6",
                                    borderRadius: "10px",
                                    padding: "14px 16px",
                                }}>
                                    <p style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>
                                        {selectedAddress.street}
                                    </p>
                                    <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>
                                        {selectedAddress.city} — CEP: {selectedAddress.cep}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#374151", borderRadius: "10px" }}>
                                    <i className="pi pi-exclamation-triangle" style={{ color: "#f59e0b", fontSize: "20px" }} />
                                    <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>
                                        Nenhum endereço selecionado.{" "}
                                        <span
                                            style={{ color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}
                                            onClick={() => navigate("/cart")}
                                        >
                                            Voltar ao carrinho
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Forma de pagamento */}
                        <div style={{ background: "#1f2937", borderRadius: "14px", border: "1px solid #374151", padding: "24px" }}>
                            <h2 style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
                                <i className="pi pi-credit-card" style={{ marginRight: "8px", color: "#3b82f6" }} />
                                Forma de Pagamento
                            </h2>

                            {loadingFormas ? (
                                <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
                                    <ProgressSpinner style={{ width: "36px", height: "36px" }} strokeWidth="4" />
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {formas.map((forma) => {
                                        const selecionado = formaSelecionada === forma.type;
                                        const ehPix       = forma.type === "PIX";
                                        return (
                                            <label
                                                key={forma.id}
                                                style={{
                                                    display:       "flex",
                                                    alignItems:    "center",
                                                    gap:           "14px",
                                                    background:    selecionado ? "#1e3a5f" : "#111827",
                                                    border:        `1px solid ${selecionado ? "#3b82f6" : "#374151"}`,
                                                    borderRadius:  "10px",
                                                    padding:       "14px 16px",
                                                    cursor:        "pointer",
                                                    transition:    "all 0.2s",
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="formaPgto"
                                                    value={forma.type}
                                                    checked={selecionado}
                                                    onChange={() => setFormaSelecionada(forma.type)}
                                                    style={{ accentColor: "#3b82f6" }}
                                                />
                                                <i
                                                    className={iconForTipo(forma.type)}
                                                    style={{ fontSize: "20px", color: selecionado ? "#3b82f6" : "#6b7280", width: "22px" }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>
                                                        {labelForTipo(forma.type)}
                                                    </p>
                                                    <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                                                        {forma.description}
                                                    </p>
                                                </div>
                                                {ehPix && (
                                                    <span style={{
                                                        background: "#166534",
                                                        color: "#4ade80",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        padding: "3px 8px",
                                                        borderRadius: "99px",
                                                    }}>
                                                        5% OFF
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Coluna direita: resumo financeiro + botão ── */}
                    <div style={{ position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "16px" }}>

                        <div style={{ background: "#1f2937", borderRadius: "14px", border: "1px solid #374151", padding: "24px" }}>
                            <h2 style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>
                                Resumo do Pedido
                            </h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#9ca3af", fontSize: "14px" }}>Subtotal ({items.length} {items.length === 1 ? "item" : "itens"})</span>
                                    <span style={{ color: "#f3f4f6", fontSize: "14px" }}>R$ {fmt(subtotal)}</span>
                                </div>

                                {isPix && (
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#4ade80", fontSize: "14px" }}>Desconto PIX (5%)</span>
                                        <span style={{ color: "#4ade80", fontSize: "14px" }}>- R$ {fmt(desconto)}</span>
                                    </div>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#9ca3af", fontSize: "13px" }}>Frete</span>
                                    <span style={{ color: "#4ade80", fontSize: "13px" }}>Grátis</span>
                                </div>
                            </div>

                            <Divider style={{ borderColor: "#374151", margin: "16px 0" }} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <span style={{ color: "#f3f4f6", fontSize: "15px", fontWeight: 600 }}>Total</span>
                                <span style={{ color: "#f3f4f6", fontSize: "22px", fontWeight: 800 }}>
                                    R$ {fmt(totalFinal)}
                                </span>
                            </div>

                            {isPix && (
                                <p style={{ color: "#4ade80", fontSize: "11px", textAlign: "right", marginBottom: "20px" }}>
                                    Economia de R$ {fmt(desconto)} no PIX
                                </p>
                            )}
                            {!isPix && <div style={{ marginBottom: "20px" }} />}

                            <Button
                                label={submitting ? "Processando..." : "Confirmar Pedido"}
                                icon={submitting ? undefined : "pi pi-check-circle"}
                                className="w-full"
                                loading={submitting}
                                disabled={submitting || !selectedAddressId || !formaSelecionada}
                                onClick={handleConfirm}
                                style={{
                                    background:    "#ea580c",
                                    border:        "none",
                                    fontSize:      "15px",
                                    fontWeight:    700,
                                    padding:       "14px",
                                    borderRadius:  "10px",
                                }}
                            />

                            <p style={{ color: "#6b7280", fontSize: "11px", textAlign: "center", marginTop: "12px", lineHeight: 1.5 }}>
                                Ao confirmar, seu pedido será registrado e o carrinho será esvaziado.
                            </p>
                        </div>

                        {/* Segurança */}
                        <div style={{ background: "#1f2937", borderRadius: "12px", border: "1px solid #374151", padding: "16px" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                <i className="pi pi-shield" style={{ color: "#3b82f6", fontSize: "18px", marginTop: "1px" }} />
                                <div>
                                    <p style={{ color: "#d1d5db", fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Compra segura</p>
                                    <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                                        Seus dados estão protegidos e o pedido é vinculado à sua conta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
