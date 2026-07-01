import type { IAddress, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const addressURL = "/addresses";

const findAll = async (): Promise<IResponse> => {
    try {
        const data = await api.get(addressURL);
        return { status: 200, success: true, message: "Endereços carregados.", data: data.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao carregar endereços.", data: err.response?.data };
    }
};

const save = async (address: IAddress): Promise<IResponse> => {
    try {
        const data = await api.post(addressURL, address);
        return { status: 201, success: true, message: "Endereço salvo.", data: data.data };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao salvar endereço.", data: err.response?.data };
    }
};

const remove = async (id: number): Promise<IResponse> => {
    try {
        await api.delete(`${addressURL}/${id}`);
        return { status: 200, success: true, message: "Endereço removido." };
    } catch (err: any) {
        return { status: err.response?.status || 500, success: false, message: "Erro ao remover endereço.", data: err.response?.data };
    }
};

const AddressService = { findAll, save, remove };
export default AddressService;
