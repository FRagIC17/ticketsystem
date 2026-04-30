package quarkus.philip.dk.RESTEndpoints;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.Comment;
import quarkus.philip.dk.CommentDTO;
import quarkus.philip.dk.CommentView;
import quarkus.philip.dk.Ticket;
import quarkus.philip.dk.TicketDTO;
import quarkus.philip.dk.TicketView;
import quarkus.philip.dk.UpdateTicketDTO;

@Path("/api/tickets")
public class TicketEndpoint {

    @Inject
    EntityManager em;

    @GET
    public Response getTickets() {
        try {
            TypedQuery<TicketView> query = em.createQuery("SELECT tv FROM TicketView tv", TicketView.class);
            return Response.ok(query.getResultList()).build();

        } catch (Exception e) {
            // catch if no tickets are found, return string "No tickets found"
            return Response.ok("No tickets found").build();
        }
    }

    @GET
    @Path("/search")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTicketsBySearchTerm(@QueryParam("search") String searchTerm) {
        System.out.println("Received search term: " + searchTerm);
        try {
            TypedQuery<TicketView> query = em
                    .createQuery("SELECT tv FROM TicketView tv WHERE LOWER(tv.title) LIKE LOWER(:search_term)" +
                            "OR LOWER(tv.category) LIKE LOWER(:search_term)" +
                            "OR LOWER(tv.status) LIKE LOWER(:search_term)" +
                            "OR LOWER(tv.priority) LIKE LOWER(:search_term)", TicketView.class);
            query.setParameter("search_term", "%" + searchTerm + "%");
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            return Response.ok("No tickets found for search term: " + searchTerm).build();
        }
    }

    @GET
    @Path("/ticket-by-id")
    public Response getTicketById(@QueryParam("id") int id) {
        try {
            TypedQuery<TicketView> query = em.createQuery("SELECT tv FROM TicketView tv WHERE tv.id = :id",
                    TicketView.class);
            query.setParameter("id", id);
            return Response.ok(query.getSingleResult()).build();
        } catch (Exception e) {
            // catch if no ticket is found, return string "No ticket with id {id} found"
            return Response.ok("No ticket with id " + id + " found").build();
        }
    }

    @DELETE
    @Transactional
    @Path("/delete-ticket")
    public Response deleteTicket(@QueryParam("id") int id) {
        try {
            Query query = em.createQuery("DELETE FROM Ticket t WHERE t.id = :id");
            query.setParameter("id", id);
            int deletedRows = query.executeUpdate();
            if (deletedRows == 0) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No ticket with id " + id + " found")
                        .build();
            }
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to delete ticket: " + e.getMessage())
                    .build();
        }
    }

    @POST
    @Transactional
    @Path("/create-ticket")
    public Response createTicket(TicketDTO dto) {

        Ticket ticket = new Ticket();

        ticket.title = dto.title;
        ticket.description = dto.description;

        ticket.categoryId = dto.categoryId;
        ticket.statusId = dto.statusId;
        ticket.priorityId = dto.priorityId;

        ticket.createdBy = dto.createdByUserId;
        ticket.assignedTo = dto.assignedToItSupporterId;

        em.persist(ticket);

        return Response.ok().build();
    }

    @PUT
    @Transactional
    @Path("/update-ticket-status")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTicketStatus(UpdateTicketDTO dto) {
        try {
            Query query = em.createQuery("UPDATE Ticket t SET t.statusId = :status_id WHERE t.id = :id");
            query.setParameter("id", dto.ticketId);
            query.setParameter("status_id", dto.statusId);
            int updatedRows = query.executeUpdate();

            if (updatedRows == 0) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No ticket with id " + dto.ticketId + " found")
                        .build();
            }

            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to update ticket status: " + e.getMessage())
                    .build();
        }
    }

    @PUT
    @Transactional
    @Path("/update-ticket-priority")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTicketPriority(UpdateTicketDTO dto) {
        try {
            Query query = em.createQuery("UPDATE Ticket t SET t.priorityId = :priority_id WHERE t.id = :id");
            query.setParameter("id", dto.ticketId);
            query.setParameter("priority_id", dto.priorityId);
            int updatedRows = query.executeUpdate();

            if (updatedRows == 0) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No ticket with id " + dto.ticketId + " found")
                        .build();
            }

            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to update ticket priority: " + e.getMessage())
                    .build();
        }
    }

    @PUT
    @Transactional
    @Path("/reassign-ticket")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reassignTicket(UpdateTicketDTO dto) {
        try {
            Query query = em.createQuery("UPDATE Ticket t SET t.assignedTo = :assigned_to WHERE t.id = :id");
            query.setParameter("id", dto.ticketId);
            query.setParameter("assigned_to", dto.assignedTo);
            int updatedRows = query.executeUpdate();
            if (updatedRows == 0) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("No ticket with id " + dto.ticketId + " found")
                        .build();
            }
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to reassign ticket: " + e.getMessage())
                    .build();
        }
    }

    @GET
    @Path("/comments-by-ticket-id")
    public Response getCommentsByTicketId(@QueryParam("ticketId") Long ticketId) {
        try {
            TypedQuery<CommentView> query = em.createQuery("SELECT c FROM CommentView c WHERE c.ticketId = :ticket_id", CommentView.class);
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
            Comment comment = new Comment();
            comment.ticketId = dto.ticketId;
            comment.commentText = dto.commentText;
            comment.createdBy = dto.createdBy;
            comment.isSupportComment = dto.isSupportComment;
            comment.createdAt = LocalDateTime.now();

            em.persist(comment);

            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Failed to add comment: " + e.getMessage())
                    .build();
        }
    }
}
