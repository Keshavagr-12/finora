import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  CLIENT_URL: z.string().url(),

  MONGO_URI: z.string().min(1),

  AI_SERVICE_URL: z.string().url(),

  AI_SERVICE_TIMEOUT: z.coerce.number().int().positive().default(5000),

  JWT_ACCESS_SECRET: z.string().min(64),

  JWT_ACCESS_EXPIRY: z.literal("15m").default("15m"),

  REFRESH_TOKEN_EXPIRY_DAYS: z.coerce.number().int().min(1).max(30).default(7),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment configuration:",
    result.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = result.data;
