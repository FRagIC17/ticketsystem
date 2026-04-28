package quarkus.philip.dk.RESTEndpoints;

import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import quarkus.philip.dk.Priority;
import quarkus.philip.dk.Status;

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
            //catch if no priorities are found, return string "No priorities found"
            return Response.ok("No priorities found").build();
        }
    }

    @GET
    @Path("/statuses")
    public Response getStatuses() {
        try {
            TypedQuery<Status> query = em.createQuery("SELECT p FROM Status p", Status.class);
            return Response.ok(query.getResultList()).build();
        } catch (Exception e) {
            //catch if no statuses are found, return string "No statuses found"
            return Response.ok("No statuses found").build();
        }
    }
}
