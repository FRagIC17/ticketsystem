package quarkus.philip.dk;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name = "comment_view")
public class CommentView {
    @Id public Long id;
    @Column(name = "ticket_id") public Long ticketId;
    @Column(name = "comment_text") public String commentText;
    @Column(name = "created_by") public Long createdBy;
    @Column(name = "first_name") public String firstName;
    @Column(name = "last_name") public String lastName;
    @Column(name = "email") public String email;
    @Column(name = "role") public String role;
    @Column(name = "is_support_comment") public boolean isSupportComment;
    @Column(name = "created_at") public LocalDateTime createdAt;
}
