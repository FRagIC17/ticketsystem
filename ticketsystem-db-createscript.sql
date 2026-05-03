#CREATE DATABASE ticketsystem_db;
USE ticketsystem_db;
-- =========================================
-- USERS
-- =========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('USER', 'SUPPORT') NOT NULL
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
        FOREIGN KEY (assigned_to) REFERENCES users(id),
    
    CONSTRAINT fk_ticket_status 
        FOREIGN KEY (status_id) REFERENCES ticket_status(id),
    
    CONSTRAINT fk_ticket_priority 
        FOREIGN KEY (priority_id) REFERENCES ticket_priority(id),
    
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
-- COMMENTS TABLE
-- =========================================
CREATE TABLE ticket_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    created_by BIGINT NOT NULL,
    is_support_comment BOOLEAN,
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
-- KNOWLEDGE BASE
-- =========================================
CREATE TABLE knowledge_base (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    -- slug VARCHAR(255) NOT NULL UNIQUE,
    article_body TEXT NOT NULL,
    summary TEXT,

    category_id INT NOT NULL,
    tags VARCHAR(255),

    created_by BIGINT NOT NULL,
    updated_by BIGINT NULL,
    
    is_public_for_user BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    
    CONSTRAINT fk_kb_category_id
		FOREIGN KEY	(category_id)
        REFERENCES ticket_category(id),

    CONSTRAINT fk_kb_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    CONSTRAINT fk_kb_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id),

    INDEX idx_kb_category (category_id),
    -- INDEX idx_kb_slug (slug),
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
    
    t.created_by AS created_by_id,
    t.assigned_to AS assigned_to_id,

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
LEFT JOIN users s ON t.assigned_to = s.id
LEFT JOIN ticket_status ts ON t.status_id = ts.id
LEFT JOIN ticket_priority tp ON t.priority_id = tp.id
LEFT JOIN ticket_category tc ON t.category_id = tc.id
LEFT JOIN ticket_comments c ON t.id = c.ticket_id

WHERE t.deleted_at IS NULL
GROUP BY t.id;

-- =========================================
-- COMMENT VIEW
-- =========================================

CREATE OR REPLACE VIEW comment_view AS
SELECT 
    c.id,
    c.ticket_id,
    c.comment_text,
    c.created_by,
    u.first_name,
    u.last_name,
    u.email,
    u.role,
    c.is_support_comment,
    c.created_at,
    c.updated_at
FROM ticket_comments c
JOIN users u ON c.created_by = u.id;

-- =========================================
-- KNOWLEDGEBASE VIEW
-- =========================================
CREATE OR REPLACE VIEW knowledge_base_view AS
SELECT
    kb.id,
    kb.title,
    kb.summary,
    kb.article_body,
    kb.tags,
    kb.is_public_for_user,

    kb.created_at,
    kb.updated_at,

    c.id AS category_id,
    c.name AS category_name,

    -- IMPORTANT: match expected column names
    u1.id AS created_by,
    CONCAT(u1.first_name, ' ', u1.last_name) AS created_by_name,

    u2.id AS updated_by,
    CONCAT(u2.first_name, ' ', u2.last_name) AS updated_by_name

FROM knowledge_base kb
JOIN ticket_category c 
    ON kb.category_id = c.id

JOIN users u1 
    ON kb.created_by = u1.id

LEFT JOIN users u2 
    ON kb.updated_by = u2.id

WHERE kb.deleted_at IS NULL;

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