import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

// `defineConfig` rejects empty projectIds at module load, so when the env
// var is missing we substitute a placeholder. The /studio route detects this
// case earlier and renders the setup-instructions page instead of mounting
// the actual Studio, so this string is never used in practice.
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "indiskaai",
  title: "IndiskaAI Studio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
