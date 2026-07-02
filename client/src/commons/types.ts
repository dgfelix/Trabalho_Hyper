export interface IUserRegister {
    displayName: string;
    username: string;
    password: string;
}

export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: object
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export  interface  ICategory {
    id?:  number;
    name:  string;
}

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: ICategory;
  imagePath?: string;
  imageName?: string;
  contentType?: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IAddress {
  id?: number;
  city: string;
  street: string;
  cep: string;
}

export interface IFormaPgto {
  id: number;
  type: string;
  description: string;
}

export interface IItensOrder {
  productId: number;
  quantity: number;
}

export interface IOrderRequest {
  formaPgto: string;
  addressId: number;
  desconto: number;
  itens: IItensOrder[];
}

export interface IOrderResponse {
  id: number;
  date: string;
  valorInicial: number;
  desconto: number;
  valorFinal: number;
  formaPgto: string;
  username: string;
  addressId: number;
  itens: {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  }[];
}