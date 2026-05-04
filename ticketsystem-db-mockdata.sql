USE ticketsystem_db;

INSERT INTO users (first_name, last_name, email, role) VALUES
('default', 'user', 'defaultuser@default.com', 'USER'),
('Alice', 'Johnson', 'alice.johnson@company.com', 'USER'),
('Bob', 'Smith', 'bob.smith@company.com', 'USER'),
('Carol', 'Williams', 'carol.williams@company.com', 'USER'),
('David', 'Brown', 'david.brown@company.com', 'USER'),
('Emma', 'Davis', 'emma.davis@company.com', 'USER'),
('Frank', 'Miller', 'frank.miller@company.com', 'USER'),
('Grace', 'Wilson', 'grace.wilson@company.com', 'USER'),
('Henry', 'Moore', 'henry.moore@company.com', 'USER'),
('Alex', 'Rivera', 'alex.rivera@itcorp.com', 'SUPPORT'),
('Jordan', 'Kim', 'jordan.kim@itcorp.com', 'SUPPORT'),
('Sam', 'Patel', 'sam.patel@itcorp.com', 'SUPPORT'),
('Taylor', 'Morgan', 'taylor.morgan@itcorp.com', 'SUPPORT'),
('Casey', 'Bennett', 'casey.bennett@itcorp.com', 'SUPPORT'),
('Riley', 'Quinn', 'riley.quinn@itcorp.com', 'SUPPORT');


INSERT INTO ticket
(created_by, assigned_to, title, description, status_id, priority_id, category_id)
VALUES
(1, 1,
'Laptop won''t boot after update',
'After installing the latest Windows update, my laptop is stuck on the boot screen.', 1, 3, 1),

(2, 2,
'Outlook keeps crashing',
'Outlook 365 crashes every time I try to open an email with attachment.', 2, 2, 2),

(3, NULL,
'Cannot connect to VPN',
'VPN connection fails with error 809. Tried on multiple networks.', 1, 4, 3),

(4, 3,
'Printer not visible on network',
'The office printer suddenly disappeared from the network. Other people can still print.', 2, 2, 1),

(5, 1,
'Excel formulas not calculating',
'Some formulas in my Excel file stopped working after the recent Office update.', 3, 2, 2),

(6, 4,
'Internet extremely slow in meeting room',
'Download speed is less than 5 Mbps in meeting room B, while other rooms are fine.', 1, 3, 3),

(7, 2,
'Blue screen of death on desktop PC',
'Getting BSOD with error IRQL_NOT_LESS_OR_EQUAL randomly.', 2, 4, 1),

(8, NULL,
'Request for new monitor',
'My current monitor has dead pixels and is 5 years old. Requesting a replacement.', 1, 1, 4);
 
INSERT INTO knowledge_base
( title, article_body, summary, category_id, tags, created_by, updated_by, is_public_for_user )
VALUES
(
'How to Fix VPN Connection Error 809',
'This article explains common causes and solutions for VPN error 809...',
'Troubleshooting guide for VPN error 809',
1,
'vpn,network,remote-access',
2,
2,
FALSE
),
(
'Reinstalling Microsoft Office 365',
'Step-by-step instructions to completely uninstall and reinstall Office 365...',
'Clean reinstall guide for Microsoft Office',
2, 
'office,365,installation',
3,
4,
TRUE
),
(
'Troubleshooting Blue Screen of Death (BSOD)',
'Common causes and diagnostic steps for Blue Screen errors...',
'BSOD diagnosis and repair guide',
3,
'bsod,windows,crash',
1,
1,
FALSE
),
(
'Setting up Network Printer in Windows 11',
'Guide to install and troubleshoot network printers on Windows 11...',
'How to connect to network printers',
3,
'printer,network,windows11',
5,
6,
TRUE
);
 
 