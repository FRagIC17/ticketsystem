package quarkus.philip.dk;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import static jakarta.persistence.GenerationType.IDENTITY;

import java.time.LocalDateTime;

import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name="ticket")
public class Ticket {
    @Id @GeneratedValue(strategy=IDENTITY) public Long id;
    @Column(name="created_by") public String createdBy;
    @Column(name="assigned_to") public String assignedTo;
    @Column(name="title") public String title;
    @Column(name="description") public String description;
    @Column(name="comments_id") public String commentsId;
    @Column(name="status_id") public int statusId;
    @Column(name="priority_id") public int priorityId;
    @Column(name="category_id") public int categoryId;
    @Column(name="created_at") public LocalDateTime createdAt;
    @Column(name="updated_at") public LocalDateTime updatedAt;
    @Column(name="closed_at") public LocalDateTime closedAt;
    @Column(name="deleted_at") public LocalDateTime deletedAt;
}
