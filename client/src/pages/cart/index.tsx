import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";
import { resolveProductImage } from "@/lib/product-image";
import AddressService from "@/services/address-service";
import type { IAddress } from "@/commons/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = React.useRef<Toast>(null);
    const { items, totalItems, subtotal, discount, total, updateQuantity, removeItem } = useCart();
    const { authenticated } = useAuth();

    // Endereços
    const [addresses, setAddresses]               = useState<IAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    // Formulário de novo endereço
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress]           = useState<IAddress>({ city: "", street: "", cep: "" });
    const [savingAddress, setSavingAddress]     = useState(false);

    // Carrega endereços quando logado
    useEffect(() => {
        if (!authenticated) return;
        const load = async () => {
            setLoadingAddresses(true);
            try {
                const res = await AddressService.findAll();
                if (res.success && Array.isArray(res.data)) {
                    const list = res.data as IAddress[];
                    setAddresses(list);
                    if (list.length > 0) setSelectedAddressId(list[0].id ?? null);
                }
            } finally {
                setLoadingAddresses(false);
            }
        };
        load();
    }, [authenticated]);

    // -----------------------------------------------------------------------
    // Ações
    // -----------------------------------------------------------------------

    const handleSaveAddress = async () => {
        if (!newAddress.city.trim() || !newAddress.street.trim() || !newAddress.cep.trim()) {
            toast.current?.show({ severity: "warn", summary: "Atenção", detail: "Preencha todos os campos do endereço.", life: 3000 });
            return;
        }
        setSavingAddress(true);
        try {
            const res = await AddressService.save(newAddress);
            if (res.success && res.data) {
                const saved = res.data as IAddress;
                setAddresses((prev) => [...prev, saved]);
                setSelectedAddressId(saved.id ?? null);
                setNewAddress({ city: "", street: "", cep: "" });
                setShowAddressForm(false);
                toast.current?.show({ severity: "success", summary: "Endereço salvo", detail: "Endereço adicionado com sucesso.", life: 3000 });
            } else {
                toast.current?.show({ severity: "error", summary: "Erro", detail: "Não foi possível salvar o endereço.", life: 3000 });
            }
        } finally {
            setSavingAddress(false);
        }
    };

    const handleCheckout = () => {
        if (!authenticated) {
            navigate("/login", { state: { from: "/cart" } });
            return;
        }
        if (!selectedAddressId) {
            toast.current?.show({ severity: "warn", summary: "Atenção", detail: "Selecione um endereço de entrega.", life: 3000 });
            return;
        }
        const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
        navigate("/payment", { state: { selectedAddress, selectedAddressId } });
    };

    // -----------------------------------------------------------------------
    // Carrinho vazio
    // -----------------------------------------------------------------------

    if (totalItems === 0) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-column align-items-center justify-content-center" style={{ paddingTop: "80px" }}>
                <Toast ref={toast} />
                <i className="pi pi-shopping-cart" style={{ fontSize: "64px", color: "#4b5563", marginBottom: "24px" }} />
                <h2 style={{ color: "#9ca3af", fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
                    Seu carrinho está vazio
                </h2>
                <p style={{ color: "#6b7280", marginBottom: "32px" }}>
                    Adicione produtos para continuar.
                </p>
                <Button
                    label="Continuar comprando"
                    icon="pi pi-arrow-left"
                    onClick={() => navigate("/")}
                    style={{ background: "#3b82f6", border: "none", padding: "12px 28px", borderRadius: "10px" }}
                />
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // Render principal
    // -----------------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-900 pb-16" style={{ paddingTop: "80px" }}>
            <Toast ref={toast} />

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

                {/* Título */}
                <h1 style={{ color: "#f3f4f6", fontSize: "28px", fontWeight: 700, marginBottom: "32px" }}>
                    Carrinho de Compras
                    <span style={{ color: "#6b7280", fontSize: "16px", fontWeight: 400, marginLeft: "12px" }}>
                        ({totalItems} {totalItems === 1 ? "item" : "itens"})
                    </span>
                </h1>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>

                    {/* ── Coluna esquerda: itens do carrinho ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {items.map(({ product, quantity }) => (
                            <div
                                key={product.id}
                                style={{
                                    background: "#1f2937",
                                    borderRadius: "14px",
                                    border: "1px solid #374151",
                                    padding: "16px",
                                    display: "flex",
                                    gap: "16px",
                                    alignItems: "center",
                                }}
                            >
                                {/* Imagem */}
                                <div style={{ flexShrink: 0, width: "90px", height: "90px", borderRadius: "10px", overflow: "hidden", background: "#374151" }}>
                                    <img
                                        src={resolveProductImage(product.imagePath, product.name)}
                                        alt={product.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "2px" }}>
                                        {product.category?.name}
                                    </p>
                                    <h3 style={{ color: "#f3f4f6", fontSize: "15px", fontWeight: 600, marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {product.name}
                                    </h3>
                                    <p style={{ color: "#3b82f6", fontSize: "18px", fontWeight: 700 }}>
                                        R$ {fmt(product.price)}
                                    </p>
                                </div>

                                {/* Controles de quantidade */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                                    <Button
                                        icon="pi pi-minus"
                                        className="p-button-rounded p-button-outlined p-button-sm"
                                        style={{ width: "32px", height: "32px" }}
                                        onClick={() => updateQuantity(product.id!, quantity - 1)}
                                    />
                                    <span style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 700, minWidth: "28px", textAlign: "center" }}>
                                        {quantity}
                                    </span>
                                    <Button
                                        icon="pi pi-plus"
                                        className="p-button-rounded p-button-outlined p-button-sm"
                                        style={{ width: "32px", height: "32px" }}
                                        onClick={() => updateQuantity(product.id!, quantity + 1)}
                                    />
                                </div>

                                {/* Subtotal do item */}
                                <div style={{ textAlign: "right", flexShrink: 0, minWidth: "90px" }}>
                                    <p style={{ color: "#9ca3af", fontSize: "11px", marginBottom: "2px" }}>Subtotal</p>
                                    <p style={{ color: "#f3f4f6", fontSize: "15px", fontWeight: 700 }}>
                                        R$ {fmt(product.price * quantity)}
                                    </p>
                                </div>

                                {/* Remover */}
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-text p-button-danger p-button-sm"
                                    style={{ flexShrink: 0 }}
                                    onClick={() => removeItem(product.id!)}
                                    tooltip="Remover produto"
                                    tooltipOptions={{ position: "top" }}
                                />
                            </div>
                        ))}

                        {/* Link continuar comprando */}
                        <div style={{ marginTop: "8px" }}>
                            <Button
                                label="Continuar comprando"
                                icon="pi pi-arrow-left"
                                className="p-button-text"
                                style={{ color: "#6b7280" }}
                                onClick={() => navigate("/")}
                            />
                        </div>
                    </div>

                    {/* ── Coluna direita: resumo + endereço ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        {/* Resumo financeiro */}
                        <div style={{ background: "#1f2937", borderRadius: "14px", border: "1px solid #374151", padding: "24px" }}>
                            <h2 style={{ color: "#f3f4f6", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>
                                Resumo do Pedido
                            </h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#9ca3af", fontSize: "14px" }}>Subtotal ({totalItems} itens)</span>
                                    <span style={{ color: "#f3f4f6", fontSize: "14px" }}>R$ {fmt(subtotal)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#4ade80", fontSize: "14px" }}>Desconto Pix (5%)</span>
                                    <span style={{ color: "#4ade80", fontSize: "14px" }}>- R$ {fmt(discount)}</span>
                                </div>
                            </div>

                            <Divider style={{ borderColor: "#374151", margin: "16px 0" }} />

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                                <span style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: 600 }}>Total no Pix</span>
                                <span style={{ color: "#f3f4f6", fontSize: "22px", fontWeight: 800 }}>R$ {fmt(total)}</span>
                            </div>

                            <Button
                                label={authenticated ? "Finalizar Compra" : "Entrar para Finalizar"}
                                icon={authenticated ? "pi pi-check" : "pi pi-sign-in"}
                                className="w-full"
                                style={{
                                    background: "#ea580c",
                                    border: "none",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    padding: "14px",
                                    borderRadius: "10px",
                                }}
                                onClick={handleCheckout}
                            />

                            {!authenticated && (
                                <p style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
                                    Faça login para finalizar sua compra. Seu carrinho será mantido.
                                </p>
                            )}
                        </div>

                        {/* Seção de endereços */}
                        <div style={{ background: "#1f2937", borderRadius: "14px", border: "1px solid #374151", padding: "24px" }}>
                            <h2 style={{ color: "#f3f4f6", fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
                                <i className="pi pi-map-marker" style={{ marginRight: "8px", color: "#3b82f6" }} />
                                Endereço de Entrega
                            </h2>

                            {!authenticated ? (
                                <div style={{ textAlign: "center", padding: "16px 0" }}>
                                    <i className="pi pi-lock" style={{ fontSize: "32px", color: "#4b5563", marginBottom: "12px", display: "block" }} />
                                    <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>
                                        Faça login para ver ou cadastrar endereços.
                                    </p>
                                    <Button
                                        label="Fazer Login"
                                        icon="pi pi-sign-in"
                                        className="p-button-outlined p-button-sm"
                                        onClick={() => navigate("/login", { state: { from: "/cart" } })}
                                        style={{ borderColor: "#3b82f6", color: "#3b82f6" }}
                                    />
                                </div>
                            ) : loadingAddresses ? (
                                <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
                                    <ProgressSpinner style={{ width: "36px", height: "36px" }} strokeWidth="4" />
                                </div>
                            ) : (
                                <div>
                                    {/* Lista de endereços */}
                                    {addresses.length > 0 ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                                            {addresses.map((addr) => (
                                                <label
                                                    key={addr.id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "flex-start",
                                                        gap: "12px",
                                                        background: selectedAddressId === addr.id ? "#1e3a5f" : "#111827",
                                                        border: `1px solid ${selectedAddressId === addr.id ? "#3b82f6" : "#374151"}`,
                                                        borderRadius: "10px",
                                                        padding: "12px",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        checked={selectedAddressId === addr.id}
                                                        onChange={() => setSelectedAddressId(addr.id ?? null)}
                                                        style={{ marginTop: "2px", accentColor: "#3b82f6" }}
                                                    />
                                                    <div>
                                                        <p style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>
                                                            {addr.street}
                                                        </p>
                                                        <p style={{ color: "#9ca3af", fontSize: "12px" }}>
                                                            {addr.city} — CEP: {addr.cep}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
                                            Nenhum endereço cadastrado.
                                        </p>
                                    )}

                                    {/* Botão adicionar endereço */}
                                    {!showAddressForm ? (
                                        <Button
                                            label="Adicionar novo endereço"
                                            icon="pi pi-plus"
                                            className="p-button-outlined p-button-sm w-full"
                                            style={{ borderColor: "#374151", color: "#9ca3af" }}
                                            onClick={() => setShowAddressForm(true)}
                                        />
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                                            <p style={{ color: "#d1d5db", fontSize: "13px", fontWeight: 600 }}>Novo endereço</p>
                                            <input
                                                placeholder="Rua / Logradouro"
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                                                style={inputStyle}
                                            />
                                            <input
                                                placeholder="Cidade"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                                                style={inputStyle}
                                            />
                                            <input
                                                placeholder="CEP (ex: 85503-390)"
                                                value={newAddress.cep}
                                                onChange={(e) => setNewAddress((p) => ({ ...p, cep: e.target.value }))}
                                                style={inputStyle}
                                            />
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <Button
                                                    label="Salvar"
                                                    icon="pi pi-check"
                                                    className="p-button-sm"
                                                    style={{ flex: 1, background: "#3b82f6", border: "none" }}
                                                    loading={savingAddress}
                                                    onClick={handleSaveAddress}
                                                />
                                                <Button
                                                    label="Cancelar"
                                                    className="p-button-sm p-button-text"
                                                    style={{ flex: 1, color: "#6b7280" }}
                                                    onClick={() => setShowAddressForm(false)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Estilo dos inputs do formulário de endereço
// ---------------------------------------------------------------------------

const inputStyle: React.CSSProperties = {
    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#f3f4f6",
    fontSize: "13px",
    width: "100%",
    outline: "none",
};
