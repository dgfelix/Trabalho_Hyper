package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;

    /** Preenchida automaticamente pelo servidor — ignorada no request. */
    private Date date;

    /** Soma bruta de todos os itens — calculada pelo servidor. */
    private BigDecimal valorInicial;

    /** Desconto em reais enviado pelo cliente. */
    private BigDecimal desconto;

    /** Valor final = valorInicial - desconto — calculado pelo servidor. */
    private BigDecimal valorFinal;

    /** Forma de pagamento: "1"=Crédito, "2"=Débito, "3"=Pix. Obrigatório. */
    @NotNull(message = "A forma de pagamento é obrigatória.")
    private String formaPgto;

    /** Nome usuário*/
    private String username;

    @NotNull(message = "O endereço de entrega é obrigatório.")
    private Long addressId;

    @NotEmpty(message = "O pedido deve conter pelo menos um item.")
    @Valid
    private List<ItensOrderDTO> itens;
}

