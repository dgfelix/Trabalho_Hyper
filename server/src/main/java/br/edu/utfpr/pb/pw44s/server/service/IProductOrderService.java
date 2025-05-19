package br.edu.utfpr.pb.pw44s.server.service;


import br.edu.utfpr.pb.pw44s.server.model.ProductOrder;
import jdk.jfr.Registered;

@Registered
public interface IProductOrderService extends ICrudService<ProductOrder, Long>{
}
