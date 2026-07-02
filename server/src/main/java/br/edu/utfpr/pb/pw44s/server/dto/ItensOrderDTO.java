package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItensOrderDTO {
    private Long id;

    private Long productId;

    private String productName;

    private BigDecimal price;
    
    private int quantity;
}
