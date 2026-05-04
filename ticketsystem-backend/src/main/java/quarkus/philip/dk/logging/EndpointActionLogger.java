package quarkus.philip.dk.logging;

import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

@ApplicationScoped
public class EndpointActionLogger {

    private static final Logger LOG = Logger.getLogger(EndpointActionLogger.class);

    public void logCreate(String resource, String details) {
        LOG.infof("CREATE %s - %s", resource, details);
    }

    public void logUpdate(String resource, String details) {
        LOG.infof("UPDATE %s - %s", resource, details);
    }

    public void logDelete(String resource, String details) {
        LOG.infof("DELETE %s - %s", resource, details);
    }

    public void logCreateSuccess(String resource, String details) {
        LOG.infof("CREATE %s succeeded - %s", resource, details);
    }

    public void logUpdateSuccess(String resource, String details) {
        LOG.infof("UPDATE %s succeeded - %s", resource, details);
    }

    public void logDeleteSuccess(String resource, String details) {
        LOG.infof("DELETE %s succeeded - %s", resource, details);
    }

    public void logCreateFailure(String resource, String details, Exception exception) {
        LOG.errorf(exception, "CREATE %s failed - %s", resource, details);
    }

    public void logUpdateFailure(String resource, String details, Exception exception) {
        LOG.errorf(exception, "UPDATE %s failed - %s", resource, details);
    }

    public void logDeleteFailure(String resource, String details, Exception exception) {
        LOG.errorf(exception, "DELETE %s failed - %s", resource, details);
    }
}