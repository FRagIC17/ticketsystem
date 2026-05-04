package quarkus.philip.dk.RESTEndpoints;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.Views.TicketView;

@Path("/api/dashboard")
public class DashboardEndpoint {

    @Inject
    EntityManager em;
    
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
}
