import { z } from "zod";

export const registerSchema = z.object({

    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100),

    email: z.string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
        .max(254),

    password: z.string()
        .min(8, "Password must contain at least 8 characters")
        .refine(
            (password) => Buffer.byteLength(password, "utf8") <= 72,
            "Password must not exceed 72 bytes"
        )

}).strict();

export const loginSchema = z.object({

    email: z.string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
        .max(254),

    password: z.string()
        .min(1, "Password is required")
        .refine(
            (password) => Buffer.byteLength(password, "utf8") <= 72,
            "Password must not exceed 72 bytes"
        )

}).strict();