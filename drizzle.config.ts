import { defineConfig } from "drizzle-kit";

if (process.env.DATABASE_URL) {
  throw new Error("DB_URL_IS_INVALID_OR_UNAVAILABLE");
}

export default defineConfig({
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: IT'S FINE ASSHOLE, ALREADY CHECKED UPTOP!
    url: process.env.DATABASE_URL!,
  },
});
