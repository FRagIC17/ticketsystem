package quarkus.philip.dk;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name="users")
public class User {
    @Id public int id;
    @Column(name="first_name") public String firstName;
    @Column(name="last_name") public String lastName;
    @Column(name="email") public String email;
    
}
