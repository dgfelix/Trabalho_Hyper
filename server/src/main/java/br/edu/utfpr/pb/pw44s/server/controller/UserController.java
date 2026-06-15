package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.UserResponseDTO;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("users")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    public UserController(UserService userService,
                          ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    /** POST /users — Cadastro público de usuário (sem autenticação). */
    @PostMapping
    public GenericResponse createUser(@RequestBody @Valid User user) {
        User newUser = modelMapper.map(user, User.class);
        userService.save(newUser);

        GenericResponse response = new GenericResponse();
        response.setMessage("User created");
        return response;
    }

    /**
     * GET /users — Lista todos os usuários (requer autenticação JWT).
     * Retorna UserResponseDTO: id, username, displayName — sem expor senha.
     */
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll() {
        List<UserResponseDTO> users = userService.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}

