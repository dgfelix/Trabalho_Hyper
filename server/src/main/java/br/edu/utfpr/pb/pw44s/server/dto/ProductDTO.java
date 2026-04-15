package br.edu.utfpr.pb.pw44s.server.dto;

/*
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

    private String imagePath;

    private CategoryDTO category;
}

 */

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String name;

    private String description;

    @NotNull(message = "O preço é obrigatório")
    @Positive(message = "O preço deve ser positivo")
    private BigDecimal price;

    @NotBlank(message = "O caminho da imagem é obrigatório")
    private String imagePath;

    @NotNull(message = "A categoria é obrigatória")
    private Long categoryId;
}

