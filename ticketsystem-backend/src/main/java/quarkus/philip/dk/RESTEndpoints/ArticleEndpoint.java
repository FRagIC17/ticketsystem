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

@Path("/api/article")
public class ArticleEndpoint {
    @Inject
    EntityManager em;

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

            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to create article").build();
        }
    }

    @DELETE
    @Transactional
    @Path("/delete-article")
    public Response deleteArticle(@QueryParam("articleId") int id) {
        try {
            Query query = em.createQuery("DELETE FROM KnowledgeBase k WHERE k.id = :id");
            query.setParameter("id", id);
            int deletedRows = query.executeUpdate();
            if (deletedRows == 0) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No article with id " + id + " found")
                        .build();
            }
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to delete article: " + e.getMessage())
                    .build();
        }
    }
}
