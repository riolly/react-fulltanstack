import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const server = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_CA_CERT: z
    .string()
    .min(1)
    .optional()
    .refine(
      (val) => {
        // In Vercel production/preview, DATABASE_CA_CERT is required
        if (
          process.env.VERCEL_ENV === "production" ||
          process.env.VERCEL_ENV === "preview"
        ) {
          return val !== undefined;
        }
        return true;
      },
      {
        message: "DATABASE_CA_CERT is required in Vercel production/preview environments",
      },
    ),
  AUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `VITE_` or similar depending on your framework.
 */
const client = z.object({
  VITE_BASE_URL: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  VITE_BASE_URL: process.env.VITE_BASE_URL,

  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_CA_CERT: process.env.DATABASE_CA_CERT,
  AUTH_SECRET: process.env.AUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

const merged = server.merge(client);
type MergedEnv = z.infer<typeof merged>;

let env: MergedEnv;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";
  const parsed = isServer
    ? merged.safeParse(processEnv)
    : client.safeParse(import.meta.env);

  if (parsed.success === false) {
    console.error(parsed.error.message);
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop: string | symbol) {
      if (typeof prop !== "string") return undefined;
      if (!isServer && !prop.startsWith("VITE_"))
        throw new Error(
          "❌ Attempted to access a server-side environment variable on the client",
        );
      return Reflect.get(target, prop);
    },
  }) as MergedEnv;
} else {
  env = processEnv as unknown as MergedEnv;
}

type ClientEnvironment = z.infer<typeof client>;

export { env };
export type { ClientEnvironment };
