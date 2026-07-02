package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.FormaPgto;
import br.edu.utfpr.pb.pw44s.server.repository.FormaPgtoRepository;
import br.edu.utfpr.pb.pw44s.server.service.IFormaPgtoService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class FormaPgtoServiceImpl extends CrudServiceImpl<FormaPgto, Long>
        implements IFormaPgtoService {

    private final FormaPgtoRepository formaPgtoRepository;

    public FormaPgtoServiceImpl(FormaPgtoRepository formaPgtoRepository) {
        this.formaPgtoRepository = formaPgtoRepository;
    }

    @Override
    protected JpaRepository<FormaPgto, Long> getRepository() {
        return formaPgtoRepository;
    }
}
