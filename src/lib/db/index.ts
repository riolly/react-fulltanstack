import { serverOnly } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as authSchema from "./schema/auth.schema";

import { env } from "env";

const driver = postgres(env.DATABASE_URL, {
  ssl: env.DATABASE_CA_CERT ? { ca: env.DATABASE_CA_CERT } : undefined,
});
const getDatabase = serverOnly(() =>
  drizzle({
    client: driver,
    schema: {
      ...authSchema,
    },
    casing: "snake_case",
  }),
);

export const db = getDatabase();
