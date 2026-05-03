package quarkus.philip.dk.DTOs;

import java.time.LocalDateTime;

import jakarta.persistence.Id;

public class KnowledgeBaseDTO {
        @Id public int id;
    public String title;
    public String slug;
    public String articleBody;
    public int categoryId;
    public Long createdBy;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public LocalDateTime deletedAt;
    public boolean isPublicForUser;
}
