package quarkus.philip.dk;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name="ticket_view")
public class TicketView {
    @Id public int id;
    @Column(name="title") public String title;
    @Column(name="description") public String description;
    @Column(name="created_by") public String createdBy;
    @Column(name="created_by_id") public Long createdById;
    @Column(name="assigned_to") public String assignedTo;
    @Column(name="assigned_to_id") public Long assignedToId;
    @Column(name="category") public String category;
    @Column(name="status") public String status;
    @Column(name="priority") public String priority;
    @Column(name="created_at") public LocalDateTime createdAt;
    @Column(name="updated_at") public LocalDateTime updatedAt;
    @Column(name="closed_at") public LocalDateTime closedAt;
    @Column(name="deleted_at") public LocalDateTime deletedAt;
}
