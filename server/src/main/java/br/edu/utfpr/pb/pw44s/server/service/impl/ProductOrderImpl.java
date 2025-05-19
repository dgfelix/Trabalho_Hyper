package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductOrderRepository;
import br.edu.utfpr.pb.pw44s.server.service.IProductOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductOrderImpl extends CrudServiceImpl<ProductOrder, Long> implements IProductOrderService {


    private final ProductOrderRepository productOrderRepository;

    public ProductOrderImpl(ProductOrderRepository productOrderRepository) {
        this.productOrderRepository = productOrderRepository;
    }

    @Override
    protected JpaRepository<ProductOrder, Long> getRepository() {
        return this.productOrderRepository;
    }

}
