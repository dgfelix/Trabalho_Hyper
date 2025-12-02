import React, { useEffect } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

const TopMenu: React.FC = () => {
    const navigate = useNavigate();
    const { authenticated, handleLogout } = useAuth();

    // Força somente o tema dark
    useEffect(() => {
        const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
        if (themeLink) {
            themeLink.href =
                "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css";
            localStorage.setItem("theme", "dark");
        }
    }, []);

    // Menu items - apenas quando autenticado
    const menuItems: MenuItem[] = authenticated
        ? [
            {
                label: "Home",
                icon: "pi pi-home",
                command: () => navigate("/home"),
            },
            {
                label: "Categorias",
                icon: "pi pi-box",
                items: [
                    {
                        label: "Listar",
                        icon: "pi pi-list",
                        command: () => navigate("/categories"),
                    },
                    {
                        label: "Novo",
                        icon: "pi pi-plus",
                        command: () => navigate("/categories/new"),
                    },
                ],
            },
            {
                label: "Produtos",
                icon: "pi pi-tags",
                items: [
                    {
                        label: "Listar",
                        icon: "pi pi-list",
                        command: () => navigate("/products"),
                    },
                    {
                        label: "Novo",
                        icon: "pi pi-plus",
                        command: () => navigate("/products/new"),
                    },
                ],
            },
        ]
        : [];

    // Handler para logout
    const handleLogoutClick = () => {
        handleLogout();
        navigate("/login");
    };

    // Handler para navegação do carrinho
    const handleCartClick = () => {
        navigate("/cart");
    };

    // Logo/Brand section
    const renderLogo = () => (
        <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
        >
            <img
                src="/assets/images/utfpr-logo-nb.png"
                alt="Logo"
                height={34}
                className="object-contain"
            />
            <span className="font-semibold text-lg hidden sm:block text-gray-200">
        PW44S
      </span>
        </div>
    );

    // Cart icon
    const renderCartIcon = () => (
        <div
            className="relative cursor-pointer hover:text-blue-300 transition-colors"
            onClick={handleCartClick}
            style={{ display: "flex", alignItems: "center" }}
        >
            <i className="pi pi-shopping-cart text-xl text-gray-200" />
        </div>
    );

    // Guest user buttons (não autenticado)
    const renderGuestButtons = () => (
        <div className="flex items-center gap-2">
            <Button
                label="Entrar"
                className="p-button-sm p-button-rounded p-button-text text-gray-200 hover:text-white transition-all"
                onClick={() => navigate("/login")}
            />
            <Button
                label="Criar Conta"
                className="p-button-sm p-button-rounded"
                style={{
                    background: "#3b82f6",
                    borderColor: "#3b82f6",
                    paddingInline: "1rem",
                    fontWeight: "600",
                }}
                onClick={() => navigate("/register")}
            />
        </div>
    );

    // Authenticated user section
    const renderAuthenticatedUser = () => (
        <div className="flex items-center gap-3">
            <Avatar
                image="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=User"
                shape="circle"
                style={{ border: "2px solid #3b82f6" }}
            />
            <Button
                icon="pi pi-sign-out"
                className="p-button-text p-button-sm text-gray-300 hover:text-white"
                onClick={handleLogoutClick}
                tooltip="Sair"
                tooltipOptions={{ position: "bottom" }}
            />
        </div>
    );

    // End section (direita do menu)
    const renderEndSection = () => (
        <div className="flex items-center gap-4">
            {renderCartIcon()}
            {authenticated ? renderAuthenticatedUser() : renderGuestButtons()}
        </div>
    );

    return (
        <div
            className="fixed top-0 left-0 w-full z-50"
            style={{
                backgroundColor: "#1f2937",
                boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
            }}
        >
            <Menubar
                model={menuItems}
                start={renderLogo()}
                end={renderEndSection()}
                className="text-gray-200 px-3"
                style={{
                    background: "transparent",
                    border: "none",
                }}
            />
        </div>
    );
};

export default TopMenu;