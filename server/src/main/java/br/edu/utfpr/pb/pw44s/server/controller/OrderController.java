package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ItensOrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController {

    private final IOrderService orderService;

    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    /**POST /orders
     * Body: { "addressId": 1, "itens": [{ "productId": 2, "quantity": 3 }] }*/
    @PostMapping
    public ResponseEntity<OrderDTO> create(
            @RequestBody @Valid OrderDTO orderDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        Order order = orderService.createOrder(orderDTO, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(order));
    }

    /**Lista todos os pedidos do usuário autenticado.
     * GET /orders*/
    @GetMapping
    public ResponseEntity<List<OrderDTO>> findAll(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<OrderDTO> orders = orderService
                .findByUsername(userDetails.getUsername())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orders);
    }

    /**Retorna os detalhes de um pedido específico pelo ID.
     * GET /orders/{id}*/
    @GetMapping("{id}")
    public ResponseEntity<OrderDTO> findById(@PathVariable Long id) {
        Order order = orderService.findOne(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDTO(order));
    }

    // --- mapeamento interno ---
    private OrderDTO toDTO(Order order) {
        List<ItensOrderDTO> itensDTO = order.getItens().stream()
                .map(item -> ItensOrderDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .date(order.getDate())
                .valorInicial(order.getValorInicial())
                .desconto(order.getDesconto())
                .valorFinal(order.getValorFinal())
                .formaPgto(order.getFormaPgto())
                .username(order.getUser().getUsername())
                .addressId(order.getAddress() != null ? order.getAddress().getId() : null)
                .itens(itensDTO)
                .build();
    }
}
