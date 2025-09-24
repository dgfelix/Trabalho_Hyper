package br.edu.utfpr.pb.pw44s.server;


import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class userTest {


    @Autowired
    UserRepository userRepository;





    @Test
    void testUser(){
        List<User> user = userRepository.findAll();
        System.out.println(user);




    }


}
