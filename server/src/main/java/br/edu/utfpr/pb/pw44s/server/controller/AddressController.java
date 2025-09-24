package br.edu.utfpr.pb.pw44s.server.controller;


import br.edu.utfpr.pb.pw44s.server.dto.UserDTO;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.IAddressService;
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {


    private final ModelMapper modelMapper;

    private final IAddressService iAddressService;

    private final IUserService iUserService;

    public AddressController(ModelMapper modelMapper, IAddressService iAddressService, IUserService iUserService) {

        this.iAddressService = iAddressService;
        this.modelMapper = modelMapper;
        this.iUserService = iUserService;
    }



    @PostMapping
    public GenericResponse creatAddress(@RequestBody Address address) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = iUserService.findByUsername(username);

        Address newAddress = modelMapper.map(address, Address.class);
        address.setUser(user);
        iAddressService.save(newAddress);
        return new GenericResponse("Address criado com sucesso!");
    }

    @GetMapping("findAll")
    public List<Address> findAll() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = iUserService.findByUsername(username);

        List<Address> addresses = iAddressService.findAllAddressByUser(user);
        return addresses;

    }

    @GetMapping("findOne")
    public Address findOne(@RequestParam Long id) {
        Address addressToreturn = iAddressService.findOne(id);
        return addressToreturn;
    }



}
