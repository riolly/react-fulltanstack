import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: ["./src/lib/server/schema/user.schema.ts"],
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    // cannot use env.ts
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
