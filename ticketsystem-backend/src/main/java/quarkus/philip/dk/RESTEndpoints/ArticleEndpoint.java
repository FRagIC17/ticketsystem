package quarkus.philip.dk.RESTEndpoints;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.KnowledgeBase;
import quarkus.philip.dk.DTOs.KnowledgeBaseDTO;
import quarkus.philip.dk.Views.KnowledgeBaseView;
import quarkus.philip.dk.logging.EndpointActionLogger;

@Path("/api/article")
public class ArticleEndpoint {
    @Inject
    EntityManager em;

    @Inject
    EndpointActionLogger actionLogger;

    @GET
    @Path("/articles-for-user")
    public Response getArticlesForUser() {
        try {
            TypedQuery<KnowledgeBaseView> query = em.createQuery(
                    "SELECT kbv FROM KnowledgeBaseView kbv WHERE kbv.isPublicForUser = true",
                    KnowledgeBaseView.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no articles are found, return string "No articles found"
            return Response.ok("No articles found").build();
        }
    }

    @GET
    @Path("/articles-for-supporter")
    public Response getArticlesForSupporter() {
        try {
            TypedQuery<KnowledgeBaseView> query = em.createQuery("SELECT kbv FROM KnowledgeBaseView kbv",
                    KnowledgeBaseView.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no articles are found, return string "No articles found"
            return Response.ok("No articles found").build();
        }
    }

    @PUT
    @Transactional
    @Path("/create-article")
    public Response createArticle(KnowledgeBaseDTO articleDTO) {
        try {
            actionLogger.logCreate("article",
                    "title=" + articleDTO.title + ", categoryId=" + articleDTO.categoryId + ", createdBy=" + articleDTO.createdBy);
            KnowledgeBase article = new KnowledgeBase();

            article.title = articleDTO.title;
            // article.slug = articleDTO.slug;
            article.articleBody = articleDTO.articleBody;
            article.categoryId = articleDTO.categoryId;
            article.createdBy = articleDTO.createdBy;
            article.createdAt = articleDTO.createdAt;
            article.deletedAt = articleDTO.deletedAt;
            article.isPublicForUser = articleDTO.isPublicForUser;
            em.persist(article);

            actionLogger.logCreateSuccess("article", "title=" + articleDTO.title);

            return Response.ok().build();
        } catch (Exception e) {
            actionLogger.logCreateFailure("article", "title=" + articleDTO.title, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to create article").build();
        }
    }

    @DELETE
    @Transactional
    @Path("/delete-article")
    public Response deleteArticle(@QueryParam("articleId") int id) {
        try {
            actionLogger.logDelete("article", "articleId=" + id);
            Query query = em.createQuery("DELETE FROM KnowledgeBase k WHERE k.id = :id");
            query.setParameter("id", id);
            int deletedRows = query.executeUpdate();
            if (deletedRows == 0) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No article with id " + id + " found")
                        .build();
            }
            actionLogger.logDeleteSuccess("article", "articleId=" + id);
            return Response.ok().build();
        } catch (Exception e) {
            actionLogger.logDeleteFailure("article", "articleId=" + id, e);
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to delete article: " + e.getMessage())
                    .build();
        }
    }
}
