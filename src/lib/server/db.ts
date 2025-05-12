import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as userSchema from "./schema/user.schema";

import { env } from "env";

const driver = postgres(env.DATABASE_URL, {
  ssl: env.DATABASE_CA_CERT ? { ca: env.DATABASE_CA_CERT } : undefined,
});

export const db = drizzle(driver, {
  schema: {
    ...userSchema,
  },
  casing: "snake_case",
});
