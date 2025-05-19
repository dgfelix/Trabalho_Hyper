package br.edu.utfpr.pb.pw44s.server.controller;


import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("order")
public class OrderController {

    private final ModelMapper modelMapper;

    private final IOrderService iOrderService;


    public OrderController(IOrderService iOrderService, ModelMapper modelMapper) {
        this.iOrderService = iOrderService;
        this.modelMapper = modelMapper;

    }


    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order savedOrder = iOrderService.save(order);
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
