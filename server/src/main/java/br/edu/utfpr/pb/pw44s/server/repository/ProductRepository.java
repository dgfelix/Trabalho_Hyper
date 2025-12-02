package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Busca todos os produtos de uma categoria específica
     * @param categoryId ID da categoria
     * @return Lista de produtos da categoria
     */
    List<Product> findByCategoryId(Long categoryId);

    /**
     * Busca produtos por nome (case-insensitive, parcial)
     * @param name Nome ou parte do nome
     * @return Lista de produtos encontrados
     */
    List<Product> findByNameContainingIgnoreCase(String name);

}

