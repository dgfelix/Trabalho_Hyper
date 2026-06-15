package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItensOrderDTO {
    private Long id;

    private Long productId;

    private String productName;

    private Double price;
    
    private int quantity;
}
