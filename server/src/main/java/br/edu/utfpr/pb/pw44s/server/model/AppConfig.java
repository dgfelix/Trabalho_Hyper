package br.edu.utfpr.pb.pw44s.server.model;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    public ModelMapper modelMapper() {
        return new ModelMapper(); // Configuração básica
    }
}