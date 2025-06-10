import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: [
    "./src/lib/db/schema/auth.schema.ts",
  ],
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL as string, // cannot use env.ts here
  },
} satisfies Config;
