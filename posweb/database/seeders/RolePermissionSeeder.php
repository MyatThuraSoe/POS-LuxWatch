<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['guard_name' => 'sanctum', 'description' => 'System administrator with full access to user management and system configuration']
        );

        $ownerRole = Role::firstOrCreate(
            ['name' => 'owner'],
            ['guard_name' => 'sanctum', 'description' => 'Business owner with financial oversight and full business control']
        );

        $employeeRole = Role::firstOrCreate(
            ['name' => 'employee'],
            ['guard_name' => 'sanctum', 'description' => 'Regular employee with POS operations and limited data access']
        );

        // Create Permissions
        $permissions = [
            // Auth permissions
            ['name' => 'auth.login', 'module' => 'auth', 'description' => 'Login to the system'],
            ['name' => 'auth.logout', 'module' => 'auth', 'description' => 'Logout from the system'],
            
            // Role management permissions
            ['name' => 'roles.manage', 'module' => 'roles', 'description' => 'Create, update, delete roles'],
            ['name' => 'roles.view', 'module' => 'roles', 'description' => 'View roles'],
            
            // Permission management permissions
            ['name' => 'permissions.manage', 'module' => 'permissions', 'description' => 'Create, update, delete permissions'],
            ['name' => 'permissions.view', 'module' => 'permissions', 'description' => 'View permissions'],
            
            // Token management permissions
            ['name' => 'tokens.revoke', 'module' => 'tokens', 'description' => 'Revoke access tokens'],
            ['name' => 'tokens.view', 'module' => 'tokens', 'description' => 'View access tokens'],
            
            // User management permissions
            ['name' => 'users.manage', 'module' => 'users', 'description' => 'Create, update, delete users'],
            ['name' => 'users.view', 'module' => 'users', 'description' => 'View users'],
            ['name' => 'users.assign-roles', 'module' => 'users', 'description' => 'Assign roles to users'],
            
            // POS permissions
            ['name' => 'pos.sales.create', 'module' => 'pos', 'description' => 'Create new sales transactions'],
            ['name' => 'pos.sales.view', 'module' => 'pos', 'description' => 'View sales transactions'],
            ['name' => 'pos.cart.manage', 'module' => 'pos', 'description' => 'Manage shopping cart'],
            ['name' => 'pos.refund', 'module' => 'pos', 'description' => 'Process refunds'],
            
            // Product permissions
            ['name' => 'products.manage', 'module' => 'products', 'description' => 'Create, update, delete products'],
            ['name' => 'products.view', 'module' => 'products', 'description' => 'View products'],
            
            // Customer permissions
            ['name' => 'customers.manage', 'module' => 'customers', 'description' => 'Create, update, delete customers'],
            ['name' => 'customers.view', 'module' => 'customers', 'description' => 'View customers'],
            
            // Report permissions
            ['name' => 'reports.view', 'module' => 'reports', 'description' => 'View reports'],
            ['name' => 'reports.financial', 'module' => 'reports', 'description' => 'View financial reports'],
            
            // System permissions
            ['name' => 'system.info', 'module' => 'system', 'description' => 'View system information'],
            ['name' => 'audit-logs.view', 'module' => 'audit', 'description' => 'View audit logs'],
        ];

        foreach ($permissions as $permissionData) {
            Permission::firstOrCreate(
                ['name' => $permissionData['name']],
                [
                    'guard_name' => 'sanctum',
                    'module' => $permissionData['module'],
                    'description' => $permissionData['description'],
                ]
            );
        }

        // Assign permissions to ADMIN role
        $adminPermissions = Permission::whereIn('name', [
            'auth.login', 'auth.logout',
            'roles.manage', 'roles.view',
            'permissions.manage', 'permissions.view',
            'tokens.revoke', 'tokens.view',
            'users.manage', 'users.view', 'users.assign-roles',
            'products.manage', 'products.view',
            'customers.manage', 'customers.view',
            'reports.view',
            'system.info',
            'audit-logs.view',
        ])->pluck('id');

        $adminRole->permissions()->syncWithoutDetaching($adminPermissions);

        // Assign permissions to OWNER role
        $ownerPermissions = Permission::whereIn('name', [
            'auth.login', 'auth.logout',
            'roles.manage', 'roles.view',
            'permissions.manage', 'permissions.view',
            'tokens.revoke', 'tokens.view',
            'users.manage', 'users.view', 'users.assign-roles',
            'products.manage', 'products.view',
            'customers.manage', 'customers.view',
            'reports.view', 'reports.financial',
            'system.info',
            'audit-logs.view',
        ])->pluck('id');

        $ownerRole->permissions()->syncWithoutDetaching($ownerPermissions);

        // Assign permissions to EMPLOYEE role
        $employeePermissions = Permission::whereIn('name', [
            'auth.login', 'auth.logout',
            'pos.sales.create', 'pos.sales.view',
            'pos.cart.manage',
            'products.view',
            'customers.view',
        ])->pluck('id');

        $employeeRole->permissions()->syncWithoutDetaching($employeePermissions);

        // Create default admin user if not exists
        $adminUser = User::where('email', 'admin@watchshop.com')->first();
        
        if (!$adminUser) {
            
            $adminUser = User::create([
                'name'     => 'System Administrator',
                'email'    => 'admin@watchshop.com',
                'password' => bcrypt('AdminPass123!'),
                'status'   => 'active',   // ← use this instead of is_active
            ]);
        }
        
        $adminUser->roles()->syncWithoutDetaching([$adminRole->id]);

        // Create default owner user if not exists
        $ownerUser = User::where('email', 'owner@watchshop.com')->first();
        
        if (!$ownerUser) {
            $ownerUser = User::create([
                'name' => 'Business Owner',
                'email' => 'owner@watchshop.com',
                'password' => bcrypt('OwnerPass123!'),
                'status' => 'active',
            ]);
        }
        
        $ownerUser->roles()->syncWithoutDetaching([$ownerRole->id]);

        // Create default employee user if not exists
        $employeeUser = User::where('email', 'cashier@watchshop.com')->first();
        
        if (!$employeeUser) {
            $employeeUser = User::create([
                'name' => 'John Doe',
                'email' => 'cashier@watchshop.com',
                'password' => bcrypt('EmployeePass123!'),
                'is_active' => true,
            ]);
        }
        
        $employeeUser->roles()->syncWithoutDetaching([$employeeRole->id]);
    }
}
