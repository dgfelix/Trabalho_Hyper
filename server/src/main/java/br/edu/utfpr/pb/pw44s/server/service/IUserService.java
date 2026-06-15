package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;

public interface IUserService {

    User save(User user);

    List<User> findAll();


}
