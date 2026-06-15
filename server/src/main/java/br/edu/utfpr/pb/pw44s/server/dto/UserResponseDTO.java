package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de resposta para listagem de usuários.
 * Não expõe o campo password (nem o hash BCrypt).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String username;
    private String displayName;

    public UserResponseDTO(User user) {
        this.id          = user.getId();
        this.username    = user.getUsername();
        this.displayName = user.getDisplayName();
    }
}
