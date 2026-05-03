package quarkus.philip.dk;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name="knowledge_base")
public class KnowledgeBase {
    @Id public int id;
    @Column(name="title") public String title;
    //@Column(name="slug") public String slug;
    @Column(name="article_body") public String articleBody;
    @Column(name="category_id") public int categoryId;
    @Column(name="created_by") public Long createdBy;
    @Column(name="created_at") public LocalDateTime createdAt;
    @Column(name="updated_at") public LocalDateTime updatedAt;
    @Column(name="deleted_at") public LocalDateTime deletedAt;
    @Column(name="is_public_for_user") public boolean isPublicForUser;
}
