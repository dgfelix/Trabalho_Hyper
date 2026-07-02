📌 Objetivo:
Ecommerce simplificado para a Matéria de Programação Web (PW44S — UTFPR)
---
Ele oferece funcionalidades essenciais como cadastro de usuários, autenticação, listagem de produtos, realização de pedidos e formas de pagamento.
A estrutura segue princípios de **separação de responsabilidades**, **clean code** e uma organização em camadas.

---

## ⚙️ Tecnologias e Ferramentas

### Backend
- **Java 21**
- **Spring Boot 3.4.4**
- **JPA / Hibernate**
- **Banco de Dados**: H2 (in-memory, perfil dev) — recriado a cada inicialização via `import.sql`
- **Spring Security + JWT** (Auth0 java-jwt)
- **Maven**
- **ModelMapper**

### Frontend
- **React 19** + **TypeScript 5.8**
- **Vite 7**
- **PrimeReact 10** (tema lara-dark-blue)
- **Axios**
- **React Router 7**
- **React Hook Form**

---

## 🗂️ Estrutura do Projeto — Backend
```plaintext
src/main/java/
├── config           -> Configurações gerais (ModelMapper, CORS)
├── controller       -> Controllers CRUD da aplicação
├── dto              -> Objetos de transferência de dados (entrada/saída)
├── error            -> Tratamento de exceções personalizadas
├── model            -> Entidades JPA que representam as tabelas do banco
├── repository       -> Interfaces de acesso aos dados (JpaRepository)
├── security         -> Configuração de autenticação/autorização (JWT)
├── service          -> Regras de negócio
├── shared           -> Utilitários e classes auxiliares
└── ServerApplication.java -> Classe principal da aplicação Spring Boot
```

## 🗂️ Estrutura do Projeto — Frontend
```plaintext
client/src/
├── commons          -> Tipos TypeScript compartilhados (types.ts)
├── components       -> Componentes reutilizáveis (TopMenu, Layout, BannerGrid, Carrossel)
├── context          -> Contextos React (AuthContext, CartContext)
├── lib              -> Utilitários (axios, product-image resolver)
├── pages            -> Páginas da aplicação
│   ├── home         -> Vitrine com carrosséis por categoria
│   ├── product-list -> Listagem pública de produtos com filtro por categoria
│   ├── product-detail -> Página individual do produto
│   ├── cart         -> Carrinho com seleção de endereço
│   ├── payment      -> Finalização de compra (rota protegida)
│   └── orders       -> Histórico de pedidos do usuário (rota protegida)
├── routes           -> Definição de rotas (públicas e protegidas via RequireAuth)
└── services         -> Camada de comunicação com a API REST
```

---

📁 Separação de responsabilidades — Backend

- **Controller**: Recebe requisições HTTP e coordena a entrada/saída de dados (DTOs).
- **DTO**: Representa os dados que trafegam entre a API e o cliente. Nunca expõe diretamente as entidades.
- **Service**: Onde estão as regras de negócio.
- **Repository**: Interface para acesso aos dados, usando JPA (Hibernate).
- **Model**: Entidades persistidas no banco de dados.
- **Error**: Manipulação e padronização de exceções.
- **Shared**: Utilitários, helpers e enums comuns ao sistema.
- **Security**: Configuração de autenticação e autorização (filtros JWT, WebSecurity).
- **Config**: Beans e configurações gerais da aplicação.

---

🧱 Principais Entidades (model)

- **User**: Representa o usuário da aplicação
- **Address**: Endereço associado a um usuário (múltiplos por usuário)
- **Category**: Categoria de produto
- **Product**: Produto disponível para venda (com `imagePath`)
- **Order**: Pedido realizado por um usuário
- **ItensOrder**: Itens de um pedido (produto, quantidade, preço)
- **FormaPgto**: Formas de pagamento disponíveis (PIX, Crédito, Débito, Boleto)

---

## 🔐 Autenticação

- Login via `POST /login` — retorna token JWT
- Token enviado no header `Authorization: Bearer <token>` em todas as requisições autenticadas
- Rotas públicas: listagem de produtos, categorias, formas de pagamento, registro
- Rotas protegidas: finalizar compra (`/payment`), histórico de pedidos (`/orders`)

---

## 🚀 Como executar

### Backend
```bash
# Na pasta server/
mvn spring-boot:run
# Acesso: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:pw44s-dev | User: sa | Senha: (vazio)
```

### Frontend
```bash
# Na pasta client/
npm install
npm run dev
# Acesso: http://localhost:5173
```
