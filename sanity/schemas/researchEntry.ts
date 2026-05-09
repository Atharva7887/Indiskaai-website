import { defineType, defineField } from "sanity";

export default defineType({
  name: "researchEntry",
  title: "Research Entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      description: "e.g. 'A. Shirke, et al.'",
      type: "string",
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "Benchmark",
      validation: (r) => r.required(),
      options: {
        list: [
          { title: "Benchmark", value: "Benchmark" },
          { title: "Whitepaper", value: "Whitepaper" },
          { title: "Case Study", value: "Case Study" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({
      name: "venue",
      title: "Venue",
      description: "Where this was published — e.g. 'Internal technical report', 'arXiv', 'bioRxiv'.",
      type: "string",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF (upload)",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "pdfUrl",
      title: "External link (optional)",
      description:
        "If the paper is hosted elsewhere (arXiv, bioRxiv, Nature, etc.), paste the URL here. Used as a fallback when no PDF is uploaded.",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured on home page",
      description: "Surface this entry on the IndiskaAI home page.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Manual order (optional)",
      description: "Lower numbers appear first within the same date. Leave blank to sort purely by date.",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [
        { field: "featured", direction: "desc" },
        { field: "date", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", date: "date" },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: [subtitle, date].filter(Boolean).join(" · "),
      };
    },
  },
});
