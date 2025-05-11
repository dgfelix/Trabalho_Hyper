package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private CategoryDTO category;
}
