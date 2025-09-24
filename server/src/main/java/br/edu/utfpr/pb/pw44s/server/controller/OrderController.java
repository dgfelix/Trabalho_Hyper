package br.edu.utfpr.pb.pw44s.server.controller;


import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("order")
public class OrderController {

    private final ModelMapper modelMapper;

    private final IOrderService iOrderService;

    private final IUserService iUserService;


    public OrderController(IOrderService iOrderService, ModelMapper modelMapper,  IUserService iUserService) {
        this.iOrderService = iOrderService;
        this.modelMapper = modelMapper;
        this.iUserService = iUserService;

    }


    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = iUserService.findByUsername(username);
        Order newOrder = modelMapper.map(order, Order.class);
        newOrder.setUser(user);

        Order savedOrder = iOrderService.save(newOrder);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);

    }

    @GetMapping("findAll")
    public ResponseEntity<List<Order>> findAll() {
        return new ResponseEntity<>(iOrderService.findAll(), HttpStatus.OK);
    }

    @GetMapping("findOne")
    public ResponseEntity<Order> findOne(Long id) {
        Order orderToreturn = iOrderService.findOne(id);
        return new ResponseEntity<>(orderToreturn, HttpStatus.OK);
    }


}
