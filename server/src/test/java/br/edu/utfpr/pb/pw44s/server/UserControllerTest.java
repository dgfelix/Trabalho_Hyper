package br.edu.utfpr.pb.pw44s.server;

import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.UserRepository;
import br.edu.utfpr.pb.pw44s.server.shared.GenericResponse;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
// @TestMethodOrder(MethodOrderer.MethodName.class)
public class UserControllerTest {
    private static final String API_USERS = "/users";

    @Autowired
    TestRestTemplate restTemplate;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private TestRestTemplate testRestTemplate;

    @BeforeEach
    public void cleanUp() {
        userRepository.deleteAll();
        restTemplate.getRestTemplate().getInterceptors().clear();
    }

    //methodName_condition_expectedBehaviour
    @Test
    public void postUser_whenUserIsValid_receiveOk() {
        User user = createValidUser();
        ResponseEntity<Object> response =
                restTemplate.postForEntity(API_USERS, user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postUser_whenUserIsValid_userSavedToDatabase() {
        User user = createValidUser();
        ResponseEntity<Object> response =
                restTemplate.postForEntity(API_USERS, user, Object.class);
        assertThat( userRepository.count() ).isEqualTo( 1 );
    }

    @Test
    public void postUser_whenUserIsValid_receiveSuccessMessage() {
        User user = createValidUser();
        ResponseEntity<GenericResponse> response =
                restTemplate.postForEntity(API_USERS, user, GenericResponse.class);
        assertThat(response.getBody().getMessage()).isNotNull();
    }

    @Test
    public void postUser_whenUserIsValid_passwordIsHashedInDatabase() {
        User user = createValidUser();
        testRestTemplate.postForEntity(API_USERS, user, String.class);
        List<User> users = userRepository.findAll();
        User userDB = users.get(0);
        assertThat(userDB.getPassword()).isNotEqualTo( user.getPassword() );
    }

    @Test
    public void postUser_whenUserHasNullUsername_receiveBadRequest() {
        User user = createValidUser();
        user.setUsername(null);

        ResponseEntity<Object> response =
                testRestTemplate.postForEntity(API_USERS, user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postUser_whenUserHasUsernameWithLessThanRequired_receiveBadRequest() {
        User user = createValidUser();
        user.setUsername("abc");

        ResponseEntity<Object> response =
                testRestTemplate.postForEntity(API_USERS, user, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    private User createValidUser() {
        User user = new User();
        user.setDisplayName("test-Display");
        user.setUsername("test-user");
        user.setPassword("P4ssword");
        
        return user;
    }
}
