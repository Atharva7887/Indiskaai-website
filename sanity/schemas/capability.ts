import { defineType, defineField } from "sanity";

export default defineType({
  name: "capability",
  title: "Capability",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon (name or emoji)",
      description:
        "Free-form. The site renders the number badge automatically; this field is for an optional icon name (e.g. 'helix', 'spike') to be styled in the future.",
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Tags / model names",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
