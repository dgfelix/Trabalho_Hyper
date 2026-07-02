import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import OrderService from "@/services/order-service";
import type { IOrderResponse } from "@/commons/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    } catch {
        return iso;
    }
};

// Mesmo padrão de badge da tela de produtos (cor + ícone por tipo)
const pgtoMeta = (tipo: string): { label: string; icon: string; color: string } => {
    switch (tipo) {
        case "PIX":     return { label: "PIX",               icon: "pi pi-bolt",        color: "#4ade80" };
        case "CREDITO": return { label: "Cartão de Crédito", icon: "pi pi-credit-card", color: "#60a5fa" };
        case "DEBITO":  return { label: "Cartão de Débito",  icon: "pi pi-wallet",      color: "#a78bfa" };
        case "BOLETO":  return { label: "Boleto Bancário",   icon: "pi pi-barcode",     color: "#fbbf24" };
        default:        return { label: tipo,                icon: "pi pi-money-bill",  color: "#9ca3af" };
    }
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const OrdersPage = () => {
    const navigate = useNavigate();
    const toast    = useRef<Toast>(null);

    const [orders, setOrders]     = useState<IOrderResponse[]>([]);
    const [loading, setLoading]   = useState(true);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await OrderService.findAll();
            if (res.success && Array.isArray(res.data)) {
                const sorted = (res.data as IOrderResponse[]).sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setOrders(sorted);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Não foi possível carregar os pedidos.",
                    life: 4000,
                });
            }
            setLoading(false);
        };
        load();
    }, []);

    const toggleExpand = (id: number) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <div style={{ background: "#111827", minHeight: "100vh", paddingTop: "80px", paddingBottom: "64px" }}>
            <Toast ref={toast} />

            <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>

                {/* Cabeçalho — mesmo padrão da tela de produtos */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ color: "#f3f4f6", fontSize: "26px", fontWeight: 700, margin: 0 }}>
                        <i className="pi pi-receipt" style={{ marginRight: "10px", color: "#3b82f6" }} />
                        Meus Pedidos
                    </h1>
                    <div style={{ height: "3px", width: "40px", background: "#3b82f6", borderRadius: "2px", marginTop: "8px" }} />
                    <p style={{ color: "#6b7280", fontSize: "13px", margin: "8px 0 0" }}>
                        Histórico completo das suas compras
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                        <ProgressSpinner style={{ width: "48px", height: "48px" }} strokeWidth="4" />
                    </div>
                )}

                {/* Estado vazio */}
                {!loading && orders.length === 0 && (
                    <div style={{
                        background: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "16px",
                        padding: "64px 32px",
                        textAlign: "center",
                    }}>
                        <i className="pi pi-shopping-bag" style={{ fontSize: "52px", color: "#374151", display: "block", marginBottom: "20px" }} />
                        <h2 style={{ color: "#9ca3af", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                            Nenhum pedido realizado ainda
                        </h2>
                        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
                            Explore nossos produtos e faça seu primeiro pedido!
                        </p>
                        <Button
                            label="Explorar Produtos"
                            icon="pi pi-tags"
                            style={{ background: "#3b82f6", border: "none", fontWeight: 600 }}
                            onClick={() => navigate("/products")}
                        />
                    </div>
                )}

                {/* Lista */}
                {!loading && orders.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Sumário — 3 cards no mesmo estilo dos cards de produto */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "8px" }}>
                            {[
                                { label: "Total de Pedidos", value: String(orders.length),                                          icon: "pi pi-list",     color: "#60a5fa" },
                                { label: "Total Gasto",       value: fmt(orders.reduce((s, o) => s + o.valorFinal, 0)),             icon: "pi pi-wallet",   color: "#4ade80" },
                                { label: "Último Pedido",     value: fmtDate(orders[0].date),                                       icon: "pi pi-calendar", color: "#fbbf24" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    style={{
                                        background: "#1f2937",
                                        border: "1px solid #374151",
                                        borderRadius: "14px",
                                        padding: "20px 16px",
                                        textAlign: "center",
                                    }}
                                >
                                    <i className={stat.icon} style={{ fontSize: "22px", color: stat.color, display: "block", marginBottom: "10px" }} />
                                    {/* badge de rótulo — mesmo uppercase da categoria */}
                                    <span style={{
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        color: stat.color,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        display: "block",
                                        marginBottom: "6px",
                                    }}>
                                        {stat.label}
                                    </span>
                                    <p style={{ color: "#f3f4f6", fontSize: "18px", fontWeight: 800, margin: 0 }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Cards de pedido */}
                        {orders.map((order) => {
                            const pgto   = pgtoMeta(order.formaPgto);
                            const isOpen = expanded.has(order.id);
                            const totalItens = order.itens.reduce((s, i) => s + i.quantity, 0);

                            return (
                                <div
                                    key={order.id}
                                    style={{
                                        background: "#1f2937",
                                        border: `1px solid ${isOpen ? "#3b82f6" : "#374151"}`,
                                        borderRadius: "14px",
                                        overflow: "hidden",
                                        transition: "border-color 0.2s, box-shadow 0.2s",
                                        boxShadow: isOpen ? "0 8px 24px rgba(59,130,246,0.12)" : "none",
                                    }}
                                >
                                    {/* Cabeçalho clicável */}
                                    <div
                                        onClick={() => toggleExpand(order.id)}
                                        style={{
                                            padding: "18px 20px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "16px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {/* Nº do pedido — destaque como nome do produto */}
                                        <div style={{ minWidth: "80px" }}>
                                            {/* badge estilo categoria */}
                                            <span style={{
                                                fontSize: "10px",
                                                fontWeight: 700,
                                                color: "#60a5fa",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                display: "block",
                                                marginBottom: "3px",
                                            }}>
                                                Pedido
                                            </span>
                                            <p style={{ color: "#f3f4f6", fontSize: "20px", fontWeight: 800, margin: 0 }}>
                                                #{order.id}
                                            </p>
                                        </div>

                                        {/* Data */}
                                        <div style={{ flex: 1, minWidth: "130px" }}>
                                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "3px" }}>
                                                Data
                                            </span>
                                            <p style={{ color: "#d1d5db", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                                                {fmtDate(order.date)}
                                            </p>
                                        </div>

                                        {/* Badge forma de pagamento — estilo badge de categoria */}
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            background: "#111827",
                                            padding: "6px 14px",
                                            borderRadius: "999px",
                                            border: `1px solid ${pgto.color}22`,
                                        }}>
                                            <i className={pgto.icon} style={{ color: pgto.color, fontSize: "13px" }} />
                                            <span style={{
                                                color: pgto.color,
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.06em",
                                            }}>
                                                {pgto.label}
                                            </span>
                                        </div>

                                        {/* Itens */}
                                        <div style={{ textAlign: "center" }}>
                                            <span style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "3px" }}>
                                                Itens
                                            </span>
                                            <p style={{ color: "#d1d5db", fontSize: "15px", fontWeight: 700, margin: 0 }}>{totalItens}</p>
                                        </div>

                                        {/* Preço — mesmo padrão: riscado + verde + parcelamento */}
                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                            {order.desconto > 0 && (
                                                <p style={{ color: "#6b7280", fontSize: "11px", textDecoration: "line-through", margin: "0 0 2px" }}>
                                                    {fmt(order.valorInicial)}
                                                </p>
                                            )}
                                            <p style={{ color: "#4ade80", fontSize: "20px", fontWeight: 800, margin: 0 }}>
                                                {fmt(order.valorFinal)}
                                                {order.desconto > 0 && (
                                                    <span style={{ color: "#6b7280", fontSize: "10px", fontWeight: 400, marginLeft: "4px" }}>no PIX</span>
                                                )}
                                            </p>
                                            {order.desconto > 0 && (
                                                <p style={{ color: "#4ade80", fontSize: "11px", margin: "2px 0 0" }}>
                                                    economia de {fmt(order.desconto)}
                                                </p>
                                            )}
                                        </div>

                                        {/* Chevron */}
                                        <i
                                            className={isOpen ? "pi pi-chevron-up" : "pi pi-chevron-down"}
                                            style={{ color: "#6b7280", fontSize: "14px", flexShrink: 0, transition: "transform 0.2s" }}
                                        />
                                    </div>

                                    {/* Accordion — itens do pedido */}
                                    {isOpen && (
                                        <div style={{ borderTop: "1px solid #374151", padding: "16px 20px", background: "#111827" }}>
                                            <span style={{
                                                fontSize: "10px",
                                                fontWeight: 700,
                                                color: "#60a5fa",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                display: "block",
                                                marginBottom: "12px",
                                            }}>
                                                Itens do pedido
                                            </span>

                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                {order.itens.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "14px",
                                                            background: "#1f2937",
                                                            borderRadius: "10px",
                                                            padding: "12px 14px",
                                                            border: "1px solid #374151",
                                                        }}
                                                    >
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: 600, margin: "0 0 3px" }}>
                                                                {item.productName}
                                                            </p>
                                                            <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                                                                {item.quantity}× {fmt(item.price)} cada
                                                            </p>
                                                        </div>
                                                        <p style={{ color: "#4ade80", fontSize: "15px", fontWeight: 700, margin: 0, flexShrink: 0 }}>
                                                            {fmt(item.price * item.quantity)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Rodapé do accordion */}
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: "24px",
                                                marginTop: "14px",
                                                paddingTop: "14px",
                                                borderTop: "1px solid #374151",
                                                flexWrap: "wrap",
                                            }}>
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Subtotal: </span>
                                                    <span style={{ color: "#d1d5db", fontSize: "14px", fontWeight: 600 }}>{fmt(order.valorInicial)}</span>
                                                </div>
                                                {order.desconto > 0 && (
                                                    <div style={{ textAlign: "right" }}>
                                                        <span style={{ color: "#6b7280", fontSize: "12px" }}>Desconto PIX: </span>
                                                        <span style={{ color: "#4ade80", fontSize: "14px", fontWeight: 600 }}>- {fmt(order.desconto)}</span>
                                                    </div>
                                                )}
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ color: "#6b7280", fontSize: "12px" }}>Total: </span>
                                                    <span style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 800 }}>{fmt(order.valorFinal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
