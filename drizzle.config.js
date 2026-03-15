import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_LUirz5S8vKpm@ep-icy-darkness-ai9gkcr6-pooler.c-4.us-east-1.aws.neon.tech/ai-perpster-interview?sslmode=require&channel_binding=require',
  },
});