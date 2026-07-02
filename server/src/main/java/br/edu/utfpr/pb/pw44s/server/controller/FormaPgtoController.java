package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.FormaPgtoDTO;
import br.edu.utfpr.pb.pw44s.server.model.FormaPgto;
import br.edu.utfpr.pb.pw44s.server.service.IFormaPgtoService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("formas-pgto")
public class FormaPgtoController extends CrudController<FormaPgto, FormaPgtoDTO, Long> {

    private final IFormaPgtoService formaPgtoService;
    private final ModelMapper modelMapper;

    public FormaPgtoController(IFormaPgtoService formaPgtoService, ModelMapper modelMapper) {
        super(FormaPgto.class, FormaPgtoDTO.class);
        this.formaPgtoService = formaPgtoService;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<FormaPgto, Long> getService() {
        return formaPgtoService;
    }

    @Override
    public ModelMapper getModelMapper() {
        return modelMapper;
    }
}
