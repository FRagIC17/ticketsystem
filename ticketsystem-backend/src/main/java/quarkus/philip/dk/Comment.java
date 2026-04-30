package quarkus.philip.dk;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name = "comments")
public class Comment {
    @Id public int id;
    @Column(name = "ticket_id") public Long ticketId;
    @Column(name = "comment_text") public String commentText;
    @Column(name = "created_by") public Long createdBy;
    @Column(name = "created_at") public LocalDateTime createdAt;
}
