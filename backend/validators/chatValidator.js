import { z } from "zod";

export const createMessageSchema = z.object({
  conversationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid conversation ID"),

  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters"),

  clientMessageId: z
    .string()
    .uuid("Invalid client message ID")
    .optional(),
});