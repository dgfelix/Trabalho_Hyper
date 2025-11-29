import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import {Layout} from "@/components/layout";
import {CategoryListPage} from "@/pages/category-list";
import {CategoryFormPage} from "@/pages/category-form";
import {ProductListPage} from "@/pages/product-list";
import {ProductFormPage} from "@/pages/product-form";
import { NotFound } from "@/pages/not-found";
import {ProductView} from "@/pages/product-view";

export function AppRoutes() {
  return (
    <Routes>


        <Route path="login" element={<LoginPage />} />
        <Route path="cadastro" element={<RegisterPage />} />

        <Route path="/" element={<Layout />}>

            <Route  path="/products/:id"  element={<ProductFormPage  />} />

            {/* protected routes */}

        </Route>

        {/* catch all */}
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
