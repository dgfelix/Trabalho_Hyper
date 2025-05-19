package br.edu.utfpr.pb.pw44s.server.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_ProductOrder")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "pgto_id", referencedColumnName = "id")
    private FormaPgto formaPgto;




    private Long ValorUnitario;

    private Integer Quantidade;

    private Double ValorTotal;

}
