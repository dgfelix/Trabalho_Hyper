package br.edu.utfpr.pb.pw44s.server.model;


import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "tb_formaPgto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormaPgto {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String description;


}
