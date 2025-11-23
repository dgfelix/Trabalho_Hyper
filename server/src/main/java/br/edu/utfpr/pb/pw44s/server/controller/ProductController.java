package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("products")
public class ProductController extends CrudController<Product, ProductDTO, Long> {
    private final IProductService productService;
    private final ModelMapper modelMapper;

    public ProductController(IProductService productService, ModelMapper modelMapper) {
        super(Product.class, ProductDTO.class);
        this.productService = productService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Product, Long> getService() {
        return this.productService;
    }

    @Override
    public ModelMapper getModelMapper() {
        return modelMapper;
    }


    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findOne(@PathVariable Long id) {
        Product product = productService.findOne(id);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        return ResponseEntity.ok(productDTO);
    }
}
