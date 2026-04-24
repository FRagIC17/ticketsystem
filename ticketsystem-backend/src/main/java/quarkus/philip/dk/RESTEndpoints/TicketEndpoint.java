package quarkus.philip.dk.RESTEndpoints;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/api")
public class TicketEndpoint {
    
    @GET
    @Path("/tickets")
    public Response getTickets() {
        try {
            
        } catch (Exception e) {
            // TODO: handle exception
        }
        return Response.ok().build();
    }
}
