package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;
import br.edu.utfpr.pb.pw44s.server.service.IProductOrderService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("productOrder")
public class ProductOrderController {

    private final ModelMapper modelMapper;
    private final IProductOrderService iProductOrderService;

    public ProductOrderController(ModelMapper modelMapper, IProductOrderService productOrderService, IProductService iProductService) {
        this.modelMapper = modelMapper;
        this.iProductOrderService = productOrderService;
    }

    @PostMapping
    public ResponseEntity<ProductOrder> createProductOrder(@RequestBody ProductOrder productOrder) {
        ProductOrder savedProductOrder = iProductOrderService.save(productOrder);
        return new ResponseEntity<>(savedProductOrder, HttpStatus.CREATED);

    }

    @GetMapping("findAll")
    public ResponseEntity<List<ProductOrder>> findAll() {
        return new ResponseEntity<>(iProductOrderService.findAll(), HttpStatus.OK);
    }

    @GetMapping("findOne")
    public ResponseEntity<ProductOrder> findOne(Long id) {
        ProductOrder orderToreturn = iProductOrderService.findOne(id);
        return new ResponseEntity<>(orderToreturn, HttpStatus.OK);
    }

}
