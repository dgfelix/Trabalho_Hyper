package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Data do pedido preenchida automaticamente. */
    private LocalDateTime date;

    /** Soma bruta dos itens (preço × quantidade), sem desconto. */
    private BigDecimal valorInicial;

    /** Desconto aplicado ao pedido (enviado pelo cliente, 0 se não informado). */
    private BigDecimal desconto;

    /**
     * Valor final do pedido = valorInicial - desconto (calculado pelo servidor).
     */
    private BigDecimal valorFinal;

    /** Forma de pagamento: "1"=Crédito, "2"=Débito, "3"=Pix, etc. */
    private String formaPgto;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToOne
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItensOrder> itens = new ArrayList<>();
}
