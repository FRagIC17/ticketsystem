CREATE DATABASE ticketsystem_db;
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
    comment_text TEXT NOT NULL,
    created_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =========================================
-- TICKETS
-- =========================================
CREATE TABLE ticket (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    created_by VARCHAR(100) NOT NULL,
    assigned_to VARCHAR(100),

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    comments_id BIGINT NULL,

    status_id INT NOT NULL,
    priority_id INT NOT NULL,
    category_id INT NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    closed_at DATETIME NULL,
    deleted_at DATETIME NULL,

    CONSTRAINT fk_ticket_comments
        FOREIGN KEY (comments_id)
        REFERENCES ticket_comments(id),

    CONSTRAINT fk_ticket_status
        FOREIGN KEY (status_id)
        REFERENCES ticket_status(id),

    CONSTRAINT fk_ticket_priority
        FOREIGN KEY (priority_id)
        REFERENCES ticket_priority(id),

    CONSTRAINT fk_ticket_category
        FOREIGN KEY (category_id)
        REFERENCES ticket_category(id),

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
    slug VARCHAR(255) UNIQUE,
    article_body TEXT NOT NULL,
    summary TEXT,

    category VARCHAR(100),
    tags VARCHAR(255),

    created_by VARCHAR(100),
    updated_by VARCHAR(100),

    is_published BOOLEAN DEFAULT TRUE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    INDEX idx_kb_category (category),
    INDEX idx_kb_slug (slug),
    INDEX idx_kb_created_at (created_at)

) ENGINE=InnoDB;



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