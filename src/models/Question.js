/**
 * Question Structure Documentation (Native MongoDB)
 * 
 * Fields:
 * - guestName: string
 * - subject: string
 * - content: string
 * - answer: {
 *     text: string,
 *     repliedBy: string,
 *     repliedAt: Date
 *   }
 * - status: enum ["pending", "answered", "hidden"]
 * - createdAt: Date
 * - updatedAt: Date
 */

export const QuestionStatus = ["pending", "answered", "hidden"];
