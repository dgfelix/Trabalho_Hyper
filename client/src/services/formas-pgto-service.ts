import type { IFormaPgto, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const findAll = async (): Promise<IResponse> => {
    try {
        const { data } = await api.get<IFormaPgto[]>("/formas-pgto");
        return { status: 200, success: true, data };
    } catch {
        return { status: 500, success: false, message: "Erro ao buscar formas de pagamento." };
    }
};

const FormasPgtoService = { findAll };
export default FormasPgtoService;
