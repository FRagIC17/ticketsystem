package quarkus.philip.dk;

import java.time.LocalDateTime;

public class CommentDTO {
    public Long id;
    public Long ticketId;
    public String commentText;
    public Long createdBy;
    public boolean isSupportComment;
    public LocalDateTime createdAt;

    public CommentDTO() {}
}
