import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { CogIcon } from "@sanity/icons";
import { schemaTypes } from "./sanity/schemas";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Document types that behave as singletons — only one document of each
// is allowed, and it's pinned at the top of the desk.
const SINGLETONS = [{ type: "siteSettings", title: "Site Settings", icon: CogIcon }];
const SINGLETON_IDS = SINGLETONS.map((s) => s.type);

export default defineConfig({
  name: "indiskaai",
  title: "IndiskaAI Studio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Pinned singletons at the top
            ...SINGLETONS.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.type)
                .icon(s.icon)
                .child(
                  S.editor()
                    .id(s.type)
                    .schemaType(s.type)
                    .documentId(s.type)
                )
            ),
            S.divider(),
            // Everything else (Team Member, Capability, Stat, Research Entry)
            ...S.documentTypeListItems().filter(
              (item) => !SINGLETON_IDS.includes(item.getId() ?? "")
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Hide "Create new" / "Delete" actions for singletons
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_IDS.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETON_IDS.includes(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action !== "duplicate" && action !== "delete" && action !== "unpublish"
          )
        : input,
  },
});
