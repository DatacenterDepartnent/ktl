/**
 * User Structure Documentation (Native MongoDB)
 * 
 * Fields:
 * - name: string
 * - email: string (unique)
 * - password: string (hashed)
 * - role: enum ["super_admin", "director", "deputy_director", "hr", "admin", "general", "editor", "user"]
 * - department: string
 * - image: string
 * - deviceId: string
 * - isActive: boolean
 * - createdAt: Date
 * - updatedAt: Date
 */

export const UserRoles = ["super_admin", "director", "deputy_director", "hr", "admin", "general", "editor", "user"];
