📌 Objetivo
Criação de um Ecommerce simplificado para a Matéria de Programação Web
---

## ⚙️ Tecnologias e Ferramentas
- **Java 21**
- **Spring Boot**
- **Spring Security**
- **JPA / Hibernate**
- **Banco de Dados**: PostgreSQL
- **Maven**

---

## 🗂️ Estrutura do Projeto

```plaintext
src/main/java/
├── config           -> Configurações gerais do projeto (CORS, beans, etc.)
├── controller       -> Controllers REST da aplicação
├── dto              -> Objetos de transferência de dados (entrada/saída)
├── error            -> Tratamento de exceções personalizadas
├── model            -> Entidades JPA que representam as tabelas do banco
├── repository       -> Interfaces de acesso aos dados (JpaRepository)
├── security         -> Configuração de autenticação/autorização
├── service          -> Regras de negócio
├── shared           -> Utilitários e classes auxiliares
└── ServerApplication.java -> Classe principal da aplicação Spring Boot

🧱 Principais Entidades (model)
User – Representa o usuário da aplicação.

Address – Endereço associado a um usuário.

Category – Categoria de produto.

Product – Produto disponível para venda.

Order – Pedido realizado por um usuário.

ItensOrder – Itens de um pedido.

ProductOrder – Relação entre produtos e pedidos.

FormaPgto – Formas de pagamento disponíveis.
