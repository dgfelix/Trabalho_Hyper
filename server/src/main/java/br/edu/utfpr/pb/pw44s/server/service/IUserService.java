package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;

public interface IUserService {

    User findByUsername(String username);


}
