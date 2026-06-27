/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig, env } from "prisma/config";

// Load local .env file in development if DATABASE_URL is not already set by host platform
if (!process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config();
  } catch (e) {
    // Ignore error if dotenv is missing in production environments
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
});
