📌 Objetivo
Criação de um Ecommerce simplificado para a Matéria de Programação Web
---
Ele oferece funcionalidades essenciais como cadastro de usuários, autenticação, listagem de produtos, realização de pedidos e formas de pagamento.
A estrutura segue princípios de **separação de responsabilidades**, **clean code** e uma organização em camadas.

## ⚙️ Tecnologias e Ferramentas
- **Java 21**
- **Spring Boot**
- **JPA / Hibernate**
- **Banco de Dados**: PostgreSQL
- **Maven**

---
## 🗂️ Estrutura do Projeto
```plaintext
src/main/java/
├── config           -> Configurações gerais do projeto
├── controller       -> Controllers CRUD da aplicação
├── dto              -> Objetos de transferência de dados (entrada/saída)
├── error            -> Tratamento de exceções personalizadas
├── model            -> Entidades JPA que representam as tabelas do banco
├── repository       -> Interfaces de acesso aos dados (JpaRepository)
├── security         -> Configuração de autenticação/autorização
├── service          -> Regras de negócio
├── shared           -> Utilitários e classes auxiliares
└── ServerApplication.java -> Classe principal da aplicação Spring Boot
```

📁 Separações da estrutura do projeto (Pastas Main)

- **Controller**: Recebe requisições HTTP e coordena a entrada/saída de dados (DTOs).
- **DTO**: Representa os dados que trafegam entre a API e o cliente. Nunca expõe diretamente as entidades.
- **Service**: Onde estão as regras de negócio.
- **Repository**: Interface para acesso aos dados, usando JPA (Hibernate).
- **Model**: Entidades persistidas no banco de dados.
- **Error**: Manipulação e padronização de exceções.
- **Shared**: Utilitários, helpers e enums comuns ao sistema.
- **Security**: Configuração de autenticação e autorização.
- **Config**: Beans e configurações gerais da aplicação.

🧱 Principais Entidades (model)

- **User:** Representa o usuário da aplicação
- **Address:** Endereço associado a um usuário
- **Category:** Categoria de produto
- **Product:** Produto disponível para venda
- **Order:** Pedido realizado por um usuário
- **ItensOrder:** Itens de um pedido
- **ProductOrder:** Relação entre produtos e pedidos
- **FormaPgto:** Formas de pagamento disponíveis
