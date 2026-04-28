package quarkus.philip.dk.RESTEndpoints;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.Ticket;

@Path("/api/dashboard")
public class DashboardEndpoint {

    @Inject
    EntityManager em;
    
    @GET
    @Path("/latest-5-tickets")
    public Response getLatest5Tickets() {
        try {
            TypedQuery<Ticket> query = em.createQuery("SELECT t FROM Ticket t ORDER BY t.createdAt DESC", Ticket.class);
            query.setMaxResults(5);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            //catch if no tickets are found, return string "No tickets found"
            return Response.ok("No tickets found").build();
        }
    }
}
