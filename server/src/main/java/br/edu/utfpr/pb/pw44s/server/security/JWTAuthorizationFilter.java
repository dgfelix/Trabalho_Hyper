package br.edu.utfpr.pb.pw44s.server.security;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.AuthService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {
    private final AuthService authService;

    public JWTAuthorizationFilter(AuthenticationManager authenticationManager, AuthService authService) {
        super(authenticationManager);
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        //Recuperar o token do Header(cabeçalho) da requisição
        String header = request.getHeader(SecurityConstants.HEADER_STRING);
        //Verifica se o token existe no cabeçalho
        if (header == null || !header.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }
        //Chama o método getAuthentication e retorna o usuário autenticado para dar sequência na requisição
        UsernamePasswordAuthenticationToken authenticationToken =
                getAuthentication(request);
        //Adiciona o usuário autenticado no contexto do spring security
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken
    getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(SecurityConstants.HEADER_STRING);
        if (token != null) {
            //verifica se o token é válido e retorna o username  
            String username =
                    JWT.require(Algorithm.HMAC512(SecurityConstants.SECRET))
                            .build()
                            .verify(token.replace(SecurityConstants.TOKEN_PREFIX, ""))
                            .getSubject();
            if (username != null) {
                try {
                    // com posse do username é verificado se ele existe na base de dados
                    User user = (User) authService.loadUserByUsername(username);
                    // o principal deve ser o objeto User (UserDetails), não apenas o username String
                    // assim @AuthenticationPrincipal UserDetails funciona corretamente nos controllers
                    return new UsernamePasswordAuthenticationToken(user, null,
                            user.getAuthorities());
                } catch (Exception e) {
                    // token aponta para usuário inexistente — tratar como não autenticado
                    return null;
                }
            }
        }
        return null;
    }
}
