package quarkus.philip.dk;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name="ticket_status")
public class Status {
    @Id public int id;
    @Column(name="name") public String name;
}
