/**
 * Log Structure Documentation (Native MongoDB)
 * 
 * Fields:
 * - userId: ObjectId (ref: User)
 * - userName: string
 * - action: string (LOGIN, REGISTER, etc.)
 * - details: string
 * - ip: string
 * - timestamp: Date
 */

export const LogActionTypes = ["LOGIN", "REGISTER", "LOGOUT", "CREATE", "UPDATE", "DELETE"];
