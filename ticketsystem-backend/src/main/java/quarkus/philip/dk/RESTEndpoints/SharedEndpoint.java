package quarkus.philip.dk.RESTEndpoints;

import java.time.LocalDateTime;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.Category;
import quarkus.philip.dk.Comment;
import quarkus.philip.dk.CommentDTO;
import quarkus.philip.dk.ItSupporter;
import quarkus.philip.dk.KnowledgeBase;
import quarkus.philip.dk.Priority;
import quarkus.philip.dk.Status;
import quarkus.philip.dk.User;

@Path("/api")
public class SharedEndpoint {

    @Inject
    EntityManager em;

    @GET
    @Path("/priorities")
    public Response getPriorities() {
        try {
            TypedQuery<Priority> query = em.createQuery("SELECT p FROM Priority p", Priority.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no priorities are found, return string "No priorities found"
            return Response.ok("No priorities found").build();
        }
    }

    @GET
    @Path("/statuses")
    public Response getStatuses() {
        try {
            TypedQuery<Status> query = em.createQuery("SELECT s FROM Status s", Status.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no statuses are found, return string "No statuses found"
            return Response.ok("No statuses found").build();
        }
    }

    @GET
    @Path("/users")
    public Response getUsers() {
        try {
            TypedQuery<User> query = em.createQuery("SELECT u FROM User u", User.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no users are found, return string "No users found"
            return Response.ok("No users found").build();
        }
    }

    @GET
    @Path("/categories")
    public Response getCategories() {
        try {
            TypedQuery<Category> query = em.createQuery("SELECT c FROM Category c", Category.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no categories are found, return string "No categories found"
            return Response.ok("No categories found").build();
        }
    }

    @GET
    @Path("/it-supporters")
    public Response getITSupporters() {
        try {
            TypedQuery<ItSupporter> query = em.createQuery("SELECT its FROM ItSupporter its", ItSupporter.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no IT supporters are found, return string "No IT supporters found"
            return Response.ok("No IT supporters found").build();
        }
    }

    @GET
    @Path("/articles-for-user")
    public Response getArticlesForUser() {
        try {
            TypedQuery<KnowledgeBase> query = em.createQuery("SELECT kb FROM KnowledgeBase kb WHERE kb.isAdmin = false",
                    KnowledgeBase.class);
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
            TypedQuery<KnowledgeBase> query = em.createQuery("SELECT kb FROM KnowledgeBase kb", KnowledgeBase.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            // catch if no articles are found, return string "No articles found"
            return Response.ok("No articles found").build();
        }
    }

    @POST
    @Path("/add-comment")
    public Response addComment(CommentDTO commentDTO) {
        try {
            
            Comment comment = new Comment();
            comment.ticketId = commentDTO.ticketId;
            comment.commentText = commentDTO.commentText;
            comment.createdBy = commentDTO.createdBy;
            comment.createdAt = commentDTO.createdAt;

            em.persist(comment);

            return Response.ok("Comment added successfully").build();
        } catch (Exception e) {
            // catch if comment could not be added, return string "Failed to add comment"
            return Response.ok("Failed to add comment").build();
        }
    }
}
