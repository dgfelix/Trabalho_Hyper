package br.edu.utfpr.pb.pw44s.server.controller;


import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {


    private final ModelMapper modelMapper;

    private final IAddressService iAddressService;

    public AddressController(ModelMapper modelMapper, IAddressService iAddressService) {

        this.iAddressService = iAddressService;
        this.modelMapper = modelMapper;
    }



    @PostMapping
    public GenericResponse creatAddress(@RequestBody Address address) {
        Address newAddress = modelMapper.map(address, Address.class);
        iAddressService.save(newAddress);
        return new GenericResponse("Address criado com sucesso!");
    }

    @GetMapping("findAll")
    public List<Address> findAll() {
       return iAddressService.findAll();
    }

    @GetMapping("findOne")
    public Address findOne(Long id) {
        Address addressToreturn = iAddressService.findOne(id);
        return addressToreturn;
    }



}
