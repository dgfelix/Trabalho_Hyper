package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FormaPgtoDTO {

    private Long id;
    private String type;
    private String description;
}
