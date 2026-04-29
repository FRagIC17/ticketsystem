#CREATE DATABASE ticketsystem_db;
USE ticketsystem_db;
-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- =========================================
-- IT SUPPORTER
-- =========================================
CREATE TABLE it_supporter (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB;



-- =========================================
-- TICKET STATUS
-- =========================================
CREATE TABLE ticket_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- =========================================
-- TICKET PRIORITY
-- =========================================
CREATE TABLE ticket_priority (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- =========================================
-- TICKET CATEGORY
-- =========================================
CREATE TABLE ticket_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;


-- =========================================
-- COMMENTS TABLE
-- =========================================
CREATE TABLE ticket_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES ticket(id),

    CONSTRAINT fk_comment_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
        
) ENGINE=InnoDB;


-- =========================================
-- TICKETS
-- =========================================
CREATE TABLE ticket (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Who created the ticket (usually a regular system user / employee / customer)
    created_by BIGINT NOT NULL,
    
    -- Who the ticket is assigned to (an IT Supporter / agent)
    assigned_to BIGINT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    status_id INT NOT NULL,
    priority_id INT NOT NULL,
    category_id INT NOT NULL,
    
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at DATETIME NULL,
    deleted_at DATETIME NULL,

    -- Foreign Keys
    CONSTRAINT fk_ticket_created_by 
        FOREIGN KEY (created_by) REFERENCES users(id),
    
    CONSTRAINT fk_ticket_assigned_to 
        FOREIGN KEY (assigned_to) REFERENCES it_supporter(id),
    
    CONSTRAINT fk_ticket_status 
        FOREIGN KEY (status_id) REFERENCES ticket_status(id),
    
    CONSTRAINT fk_ticket_priority 
        FOREIGN KEY (priority_id) REFERENCES ticket_priority(id),ticket_view,
    
    CONSTRAINT fk_ticket_category 
        FOREIGN KEY (category_id) REFERENCES ticket_category(id),

    -- Indexes (very important for performance)
    INDEX idx_ticket_created_by (created_by),
    INDEX idx_ticket_assigned_to (assigned_to),
    INDEX idx_ticket_status (status_id),
    INDEX idx_ticket_priority (priority_id),
    INDEX idx_ticket_category (category_id),
    INDEX idx_ticket_created_at (created_at),
    INDEX idx_status_priority (status_id, priority_id)
    
) ENGINE=InnoDB;


-- =========================================
-- KNOWLEDGE BASE
-- =========================================
CREATE TABLE knowledge_base (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    article_body TEXT NOT NULL,
    summary TEXT,

    category VARCHAR(100),
    tags VARCHAR(255),

    created_by BIGINT NOT NULL,
    updated_by BIGINT NULL,

    is_published BOOLEAN DEFAULT TRUE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    CONSTRAINT fk_kb_created_by
        FOREIGN KEY (created_by)
        REFERENCES it_supporter(id),

    CONSTRAINT fk_kb_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES it_supporter(id),

    INDEX idx_kb_category (category),
    INDEX idx_kb_slug (slug),
    INDEX idx_kb_created_at (created_at),
    INDEX idx_kb_created_by (created_by),
    INDEX idx_kb_updated_by (updated_by)

) ENGINE=InnoDB;


-- =========================================
-- TICKET VIEW
-- =========================================

CREATE OR REPLACE VIEW ticket_view AS
SELECT 
    t.id,
    t.title,
    t.description,

    CONCAT(u.first_name,' ',u.last_name) AS created_by,
    CONCAT(s.first_name,' ',s.last_name) AS assigned_to,

    ts.name AS status,
    tp.name AS priority,
    tc.name AS category,

    COUNT(c.id) AS comment_count,

    t.created_at,
    t.updated_at,
    t.closed_at,
    t.deleted_at,

    TIMESTAMPDIFF(HOUR,t.created_at,COALESCE(t.closed_at,NOW())) AS hours_open,
    TIMESTAMPDIFF(DAY,t.created_at,COALESCE(t.closed_at,NOW())) AS days_open

FROM ticket t
LEFT JOIN users u ON t.created_by = u.id
LEFT JOIN it_supporter s ON t.assigned_to = s.id
LEFT JOIN ticket_status ts ON t.status_id = ts.id
LEFT JOIN ticket_priority tp ON t.priority_id = tp.id
LEFT JOIN ticket_category tc ON t.category_id = tc.id
LEFT JOIN ticket_comments c ON t.id = c.ticket_id

WHERE t.deleted_at IS NULL
GROUP BY t.id;


-- =========================================
-- SEED DATA
-- =========================================
INSERT INTO ticket_status(name) VALUES
('Open'),
('In Progress'),
('Resolved'),
('Closed');

INSERT INTO ticket_priority(name) VALUES
('Low'),
('Medium'),
('High'),
('Critical');

INSERT INTO ticket_category(name) VALUES
('Hardware Issue'),
('Software Issue'),
('Network Issue'),
('Other Issue');