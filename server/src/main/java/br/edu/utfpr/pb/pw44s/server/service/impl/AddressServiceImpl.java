package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.repository.IAddressRepository;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImpl extends CrudServiceImpl<Address, Long> implements
        IAddressService {

    private final IAddressRepository iAddressRepository;


    public AddressServiceImpl(IAddressRepository iAddressRepository){
        this.iAddressRepository = iAddressRepository;

    }

    @Override
    protected JpaRepository<Address, Long> getRepository() {
        return this.iAddressRepository;
    }




}
