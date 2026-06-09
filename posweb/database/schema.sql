-- ============================================
-- POSWeb Database Schema and Seed Data
-- Converted for Laravel 12 + MySQL
-- Import this file into your 'posweb' database
-- ============================================

CREATE DATABASE IF NOT EXISTS luxwatch_db ;
USE luxwatch_db ;

-- ============================================
-- STEP 1: Create Migrations Table
-- ============================================
CREATE TABLE IF NOT EXISTS migrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 2: Create Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    phone VARCHAR(20) NULL,
    avatar_url VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX users_status_index ON users(status);
CREATE INDEX users_deleted_at_index ON users(deleted_at);

-- ============================================
-- STEP 3: Create Password Reset Tokens Table
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 4: Create Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX sessions_user_id_index ON sessions(user_id);
CREATE INDEX sessions_last_activity_index ON sessions(last_activity);

-- ============================================
-- STEP 5: Create Cache Tables
-- ============================================
CREATE TABLE IF NOT EXISTS cache (
    `key` VARCHAR(255) PRIMARY KEY,
    value LONGTEXT NOT NULL,
    expiration INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX cache_expiration_index ON cache(expiration);

CREATE TABLE IF NOT EXISTS cache_locks (
    `key` VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX cache_locks_expiration_index ON cache_locks(expiration);

-- ============================================
-- STEP 6: Create Jobs Tables
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload LONGTEXT NOT NULL,
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    reserved_at INT UNSIGNED NULL,
    available_at INT UNSIGNED NOT NULL,
    created_at INT UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX jobs_queue_index ON jobs(queue);

CREATE TABLE IF NOT EXISTS job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INT NOT NULL,
    pending_jobs INT NOT NULL,
    failed_jobs INT NOT NULL,
    failed_job_ids LONGTEXT NOT NULL,
    options LONGTEXT NULL,
    cancelled_at INT UNSIGNED NULL,
    created_at INT UNSIGNED NOT NULL,
    finished_at INT UNSIGNED NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS failed_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL,
    connection LONGTEXT NOT NULL,
    queue LONGTEXT NOT NULL,
    payload LONGTEXT NOT NULL,
    exception LONGTEXT NOT NULL,
    failed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY failed_jobs_uuid_unique (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 7: Create Personal Access Tokens Table (Sanctum)
-- ============================================
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY personal_access_tokens_token_unique (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX personal_access_tokens_tokenable_index ON personal_access_tokens(tokenable_type, tokenable_id);
CREATE INDEX personal_access_tokens_expires_at_index ON personal_access_tokens(expires_at);

-- ============================================
-- STEP 8: Create Audit Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255) NOT NULL,
    entity_id BIGINT UNSIGNED NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX audit_logs_entity_index ON audit_logs(entity_type, entity_id);
CREATE INDEX audit_logs_user_id_index ON audit_logs(user_id);
CREATE INDEX audit_logs_created_at_index ON audit_logs(created_at);

-- ============================================
-- STEP 9: Create Roles Table
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'sanctum',
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY roles_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 10: Create Permissions Table
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    guard_name VARCHAR(50) DEFAULT 'sanctum',
    module VARCHAR(50) NULL,
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY permissions_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- STEP 11: Create Role-User Pivot Table
-- ============================================
CREATE TABLE IF NOT EXISTS role_user (
    role_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    assigned_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX role_user_user_id_index ON role_user(user_id, role_id);

-- ============================================
-- STEP 12: Create Permission-Role Pivot Table
-- ============================================
CREATE TABLE IF NOT EXISTS permission_role (
    permission_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (permission_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX permission_role_role_id_index ON permission_role(role_id, permission_id);

-- ============================================
-- STEP 13: Add Foreign Key Constraints
-- ============================================
ALTER TABLE audit_logs 
    ADD CONSTRAINT audit_logs_user_id_foreign 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE personal_access_tokens 
    ADD CONSTRAINT personal_access_tokens_tokenable_foreign 
    FOREIGN KEY (tokenable_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE role_user 
    ADD CONSTRAINT role_user_role_id_foreign 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

ALTER TABLE role_user 
    ADD CONSTRAINT role_user_user_id_foreign 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE role_user 
    ADD CONSTRAINT role_user_assigned_by_foreign 
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE permission_role 
    ADD CONSTRAINT permission_role_permission_id_foreign 
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE;

ALTER TABLE permission_role 
    ADD CONSTRAINT permission_role_role_id_foreign 
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

-- ============================================
-- STEP 14: Insert Migration Records
-- ============================================
INSERT INTO migrations (migration, batch) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2026_01_02_000002_add_user_profile_fields', 1),
('2026_06_02_155943_create_personal_access_tokens_table', 1),
('2026_06_02_160321_create_audit_logs_table', 1),
('2026_06_02_161451_create_roles_and_permissions_tables', 1);

-- ============================================
-- STEP 15: Seed Roles
-- ============================================
INSERT INTO roles (name, guard_name, description, created_at, updated_at) VALUES
('ADMIN', 'sanctum', 'System administrator with full access to system configuration and user management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('OWNER', 'sanctum', 'Business owner with financial oversight and full business control', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EMPLOYEE', 'sanctum', 'Staff member with POS operations and limited data access', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- STEP 16: Seed Permissions
-- ============================================
INSERT INTO permissions (name, guard_name, module, description, created_at, updated_at) VALUES
-- Authentication permissions
('auth.login', 'sanctum', 'auth', 'Allow user to login', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('auth.logout', 'sanctum', 'auth', 'Allow user to logout', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('auth.refresh', 'sanctum', 'auth', 'Allow user to refresh token', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Role management permissions
('roles.view', 'sanctum', 'roles', 'View roles list', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('roles.create', 'sanctum', 'roles', 'Create new roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('roles.update', 'sanctum', 'roles', 'Update existing roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('roles.delete', 'sanctum', 'roles', 'Delete roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('roles.manage', 'sanctum', 'roles', 'Full role management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Permission management permissions
('permissions.view', 'sanctum', 'permissions', 'View permissions list', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('permissions.create', 'sanctum', 'permissions', 'Create new permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('permissions.update', 'sanctum', 'permissions', 'Update existing permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('permissions.delete', 'sanctum', 'permissions', 'Delete permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('permissions.manage', 'sanctum', 'permissions', 'Full permission management', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Token management permissions
('tokens.view', 'sanctum', 'tokens', 'View API tokens', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tokens.revoke', 'sanctum', 'tokens', 'Revoke API tokens', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- User management permissions
('users.view', 'sanctum', 'users', 'View users list', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('users.create', 'sanctum', 'users', 'Create new users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('users.update', 'sanctum', 'users', 'Update existing users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('users.delete', 'sanctum', 'users', 'Delete users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('users.suspend', 'sanctum', 'users', 'Suspend user accounts', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Profile permissions
('profile.update', 'sanctum', 'profile', 'Update own profile', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('profile.password', 'sanctum', 'profile', 'Change own password', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- System permissions
('system.health', 'sanctum', 'system', 'Access health endpoints', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('system.info', 'sanctum', 'system', 'Access system information', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- STEP 17: Assign Permissions to Roles
-- ============================================
-- ADMIN permissions (all permissions)
INSERT INTO permission_role (permission_id, role_id, created_at)
SELECT p.id, r.id, CURRENT_TIMESTAMP
FROM permissions p, roles r
WHERE r.name = 'ADMIN';

-- OWNER permissions (all permissions)
INSERT INTO permission_role (permission_id, role_id, created_at)
SELECT p.id, r.id, CURRENT_TIMESTAMP
FROM permissions p, roles r
WHERE r.name = 'OWNER';

-- EMPLOYEE permissions (only auth, profile, and basic view)
INSERT INTO permission_role (permission_id, role_id, created_at)
SELECT p.id, r.id, CURRENT_TIMESTAMP
FROM permissions p, roles r
WHERE r.name = 'EMPLOYEE' AND p.name IN (
    'auth.login',
    'auth.logout',
    'auth.refresh',
    'profile.update',
    'profile.password',
    'system.health'
);

-- ============================================
-- STEP 18: Seed Default Users
-- ============================================
-- Password hashes generated using bcrypt with cost 12
-- admin@watchshop.com / AdminPass123
-- owner@watchshop.com / OwnerPass123
-- employee@watchshop.com / EmployeePass123

INSERT INTO users (name, email, email_verified_at, password, is_active, phone, avatar_url, status, last_login_at, remember_token, created_at, updated_at) VALUES
('System Administrator', 'admin@watchshop.com', CURRENT_TIMESTAMP, '$2y$12$fYHTRzMZQ.KiLwNVLM1dfOfO7eRCy9VxM4S7TcgHPZ8KJRCMQ5an2', 1, '+1234567890', NULL, 'active', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Business Owner', 'owner@watchshop.com', CURRENT_TIMESTAMP, '$2y$12$3imEkTRBC81qYfO1j396EuFmy/VvYisoQBDo1upuRMiyh0T5sh0Fy', 1, '+1234567891', NULL, 'active', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('John Cashier', 'employee@watchshop.com', CURRENT_TIMESTAMP, '$2y$12$SO0NRuZu/ODCDGcRIrG46uLsnmn7NExCVjPCDPSTjccSiyhASK5fu', 1, '+1234567892', NULL, 'active', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ============================================
-- STEP 19: Assign Roles to Users
-- ============================================
-- Assign ADMIN role to first user (id=1)
INSERT INTO role_user (role_id, user_id, assigned_by, created_at)
SELECT r.id, u.id, u.id, CURRENT_TIMESTAMP
FROM roles r, users u
WHERE r.name = 'ADMIN' AND u.email = 'admin@watchshop.com';

-- Assign OWNER role to second user (id=2)
INSERT INTO role_user (role_id, user_id, assigned_by, created_at)
SELECT r.id, u.id, u.id, CURRENT_TIMESTAMP
FROM roles r, users u
WHERE r.name = 'OWNER' AND u.email = 'owner@watchshop.com';

-- Assign EMPLOYEE role to third user (id=3)
INSERT INTO role_user (role_id, user_id, assigned_by, created_at)
SELECT r.id, u.id, u.id, CURRENT_TIMESTAMP
FROM roles r, users u
WHERE r.name = 'EMPLOYEE' AND u.email = 'employee@watchshop.com';

-- ============================================
-- END OF SCRIPT
-- ============================================