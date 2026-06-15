package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.ItensOrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.ItensOrder;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long>
        implements IOrderService {

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            AddressRepository addressRepository,
                            ProductRepository productRepository,
                            AuthService authService) {
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return this.orderRepository;
    }

    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO, String username) {
        // 1. Carrega o usuário autenticado
        User user = (User) authService.loadUserByUsername(username);

        // 2. Carrega o endereço de entrega (deve pertencer ao usuário)
        Address address = addressRepository.findById(orderDTO.getAddressId())
                .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado."));

        // 3. Monta o pedido
        Order order = Order.builder()
                .user(user)
                .address(address)
                .date(new Date())
                .formaPgto(orderDTO.getFormaPgto())
                .itens(new ArrayList<>())
                .build();

        // 4. Adiciona os itens com preço vindo do produto (servidor)
        for (ItensOrderDTO itemDTO : orderDTO.getItens()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Produto não encontrado: ID " + itemDTO.getProductId()));

            ItensOrder item = ItensOrder.builder()
                    .order(order)
                    .product(product)
                    .price(product.getPrice().doubleValue())
                    .quantity(itemDTO.getQuantity())
                    .build();

            order.getItens().add(item);
        }

        // 5. Calcula valorInicial (soma bruta dos itens)
        BigDecimal valorInicial = order.getItens().stream()
                .map(item -> BigDecimal.valueOf(item.getPrice())
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 6. Desconto enviado pelo cliente (0 se não informado)
        BigDecimal desconto = orderDTO.getDesconto() != null
                ? orderDTO.getDesconto()
                : BigDecimal.ZERO;

        order.setValorInicial(valorInicial);
        order.setDesconto(desconto);
        order.setValorFinal(valorInicial.subtract(desconto));

        // 7. Salva o pedido junto com seus itens (CascadeType.ALL)
        return orderRepository.save(order);
    }

    @Override
    public List<Order> findByUsername(String username) {
        User user = (User) authService.loadUserByUsername(username);
        return orderRepository.findByUser(user);
    }
}
