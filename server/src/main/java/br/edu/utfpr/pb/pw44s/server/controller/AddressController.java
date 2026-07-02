package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.AddressDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("addresses")
public class AddressController {

    private final IAddressService addressService;
    private final AuthService authService;

    public AddressController(IAddressService addressService, AuthService authService) {
        this.addressService = addressService;
        this.authService = authService;
    }

    /** Cadastra um novo endereço vinculado ao usuário autenticado. */
    @PostMapping
    public ResponseEntity<AddressDTO> create(
            @RequestBody @Valid AddressDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = (User) authService.loadUserByUsername(userDetails.getUsername());

        Address address = Address.builder()
                .city(dto.getCity())
                .street(dto.getStreet())
                .CEP(dto.getCEP())
                .user(user)
                .build();

        Address saved = addressService.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    /** Lista todos os endereços do usuário autenticado. */
    @GetMapping
    public ResponseEntity<List<AddressDTO>> findAll(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = (User) authService.loadUserByUsername(userDetails.getUsername());

        List<AddressDTO> result = addressService.findByUser(user)
                .stream()
                .map(this::toDTO)

                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /** Busca um endereço específico por ID. */
    @GetMapping("{id}")
    public ResponseEntity<AddressDTO> findById(@PathVariable Long id) {
        Address address = addressService.findOne(id);
        if (address == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDTO(address));
    }

    /** Atualiza um endereço existente. */
    @PutMapping("{id}")
    public ResponseEntity<AddressDTO> update(
            @PathVariable Long id,
            @RequestBody @Valid AddressDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        Address existing = addressService.findOne(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existing.getUser().getUsername().equals(userDetails.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        existing.setCity(dto.getCity());
        existing.setStreet(dto.getStreet());
        existing.setCEP(dto.getCEP());

        return ResponseEntity.ok(toDTO(addressService.save(existing)));
    }

    /** Remove um endereço pelo ID. */
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id,
                       @AuthenticationPrincipal UserDetails userDetails) {
        Address existing = addressService.findOne(id);
        if (existing == null) {
            return;
        }
        if (!existing.getUser().getUsername().equals(userDetails.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        addressService.delete(id);
    }

    // --- mapeamento interno ---
    private AddressDTO toDTO(Address address) {
        return AddressDTO.builder()
                .id(address.getId())
                .city(address.getCity())
                .street(address.getStreet())
                .CEP(address.getCEP())
                .build();
    }
}
