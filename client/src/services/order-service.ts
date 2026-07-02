import type { IOrderRequest, IOrderResponse, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const create = async (order: IOrderRequest): Promise<IResponse> => {
    try {
        const { data } = await api.post<IOrderResponse>("/orders", order);
        return { status: 201, success: true, data };
    } catch (err: any) {
        const msg = err.response?.data?.message || "Erro ao finalizar o pedido.";
        return { status: err.response?.status || 500, success: false, message: msg };
    }
};

const findAll = async (): Promise<IResponse> => {
    try {
        const { data } = await api.get<IOrderResponse[]>("/orders");
        return { status: 200, success: true, data };
    } catch {
        return { status: 500, success: false, message: "Erro ao buscar pedidos." };
    }
};

const OrderService = { create, findAll };
export default OrderService;
