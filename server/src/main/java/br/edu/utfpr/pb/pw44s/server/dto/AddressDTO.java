package br.edu.utfpr.pb.pw44s.server.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private Long id;

    private String city;

    private String street;
    
    private String CEP;
}
