import { defineType, defineField } from "sanity";

export default defineType({
  name: "stat",
  title: "Stat",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      description: "Display string — e.g. '10⁶⁰', '<1%', '12yr'.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
