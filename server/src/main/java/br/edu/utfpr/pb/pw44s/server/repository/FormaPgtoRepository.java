package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.FormaPgto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormaPgtoRepository extends JpaRepository<FormaPgto, Long> {
}
