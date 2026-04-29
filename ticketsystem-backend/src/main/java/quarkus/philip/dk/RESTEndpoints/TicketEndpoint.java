package quarkus.philip.dk.RESTEndpoints;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.Ticket;
import quarkus.philip.dk.TicketView;

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
                //catch if no tickets are found, return string "No tickets found"
                return Response.ok("No tickets found").build();
        }
    }

    @GET
    @Path("/sorted-by-priority")
    public Response getTicketsByPriority(@QueryParam("priority") int priorityId) {
        try {
            TypedQuery<TicketView> query = em.createQuery("SELECT tv FROM TicketView tv WHERE tv.priorityId = :priority_id", TicketView.class);
            query.setParameter("priority_id", priorityId);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            //catch if 1. no tickets are found or 2. if the priorityId is invalid, return string "No tickets with priority {priorityId} found"
            return Response.ok("No tickets with priority " + priorityId + " found").build();
        }
    }

    @GET
    @Path("/sorted-by-status")
    public Response getTicketsByStatus(@QueryParam("status") int statusId) {
        try {
            TypedQuery<TicketView> query = em.createQuery("SELECT tv FROM TicketView tv WHERE tv.statusId = :status_id", TicketView.class);
            query.setParameter("status_id", statusId);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            //catch if 1. no tickets are found or 2. if the statusId is invalid, return string "No tickets with status {statusId} found"
            return Response.ok("No tickets with status " + statusId + " found").build();
        }
    }

    @GET
    @Path("/ticket-by-id")
    public Response getTicketById(@QueryParam("id") int id) {
        try {
            TypedQuery<TicketView> query = em.createQuery("SELECT tv FROM TicketView tv WHERE tv.id = :id", TicketView.class);
            query.setParameter("id", id);
            return Response.ok(query.getSingleResult()).build();
        } catch (Exception e) {
            //catch if no ticket is found, return string "No ticket with id {id} found"
            return Response.ok("No ticket with id " + id + " found").build();
        }
    }

    @POST
    @Transactional
    @Path("/create-ticket")
    public Response createTicket(Ticket ticket) {
        System.out.println("Received ticket: " + ticket);

        try {
            em.persist(ticket);
            return Response.ok("Ticket created successfully").build();
        } catch (Exception e) {
            //catch if ticket creation fails, return string "Failed to create ticket"
            return Response.ok("Failed to create ticket" + e).build();
        }
    }
}
