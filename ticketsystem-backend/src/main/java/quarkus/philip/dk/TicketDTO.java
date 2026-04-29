package quarkus.philip.dk;

import java.time.LocalDateTime;

public class TicketDTO {
    public String title;
    public String description;
    public int priorityId;
    public int categoryId;
    public int statusId;
    public long createdByUserId;
    public long assignedToItSupporterId;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public LocalDateTime closedAt;
    public LocalDateTime deletedAt;

    public TicketDTO(String title, String description, int priorityId, int categoryId, int statusId, long createdByUserId, long assignedToItSupporterId) {
        this.title = title;
        this.description = description;
        this.priorityId = priorityId;
        this.categoryId = categoryId;
        this.statusId = statusId;
        this.createdByUserId = createdByUserId;
        this.assignedToItSupporterId = assignedToItSupporterId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.closedAt = null;
        this.deletedAt = null;
    }
}
