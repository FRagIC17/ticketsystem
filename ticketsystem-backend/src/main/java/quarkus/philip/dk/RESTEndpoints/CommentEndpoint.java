package quarkus.philip.dk.RESTEndpoints;

import java.time.LocalDateTime;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.Comment;
import quarkus.philip.dk.DTOs.CommentDTO;
import quarkus.philip.dk.Views.CommentView;
import quarkus.philip.dk.logging.EndpointActionLogger;

@Path("/api/comment")
public class CommentEndpoint {

    @Inject
    EntityManager em;

    @Inject
    EndpointActionLogger actionLogger;

    @GET
    @Path("/comments-by-ticket-id")
    public Response getCommentsByTicketId(@QueryParam("ticketId") Long ticketId) {
        try {
            TypedQuery<CommentView> query = em.createQuery("SELECT c FROM CommentView c WHERE c.ticketId = :ticket_id",
                    CommentView.class);
            query.setParameter("ticket_id", ticketId);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            return Response.ok("No comments found for ticket with id: " + ticketId).build();
        }
    }

    @POST
    @Transactional
    @Path("/add-comment")
    public Response addComment(CommentDTO dto) {

        try {
            actionLogger.logCreate("comment",
                    "ticketId=" + dto.ticketId + ", createdBy=" + dto.createdBy + ", supportComment=" + dto.isSupportComment);
            Comment comment = new Comment();
            comment.ticketId = dto.ticketId;
            comment.commentText = dto.commentText;
            comment.createdBy = dto.createdBy;
            comment.isSupportComment = dto.isSupportComment;
            comment.createdAt = LocalDateTime.now();

            em.persist(comment);

            actionLogger.logCreateSuccess("comment", "ticketId=" + dto.ticketId);

            return Response.ok().build();
        } catch (Exception e) {
            actionLogger.logCreateFailure("comment", "ticketId=" + dto.ticketId, e);
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to add comment: " + e.getMessage())
                    .build();
        }
    }
}
