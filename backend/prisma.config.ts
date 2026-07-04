import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed_runner.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
