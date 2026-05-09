import { defineType, defineField } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn Profile URL",
      description: "Full URL — e.g. https://www.linkedin.com/in/username",
      type: "url",
    }),
    defineField({
      name: "accent",
      title: "Accent colour",
      type: "string",
      initialValue: "navy",
      options: {
        list: [
          { title: "Navy", value: "navy" },
          { title: "Gold", value: "gold" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      initialValue: "Science & Engineering",
      validation: (r) => r.required(),
      options: {
        list: [
          { title: "Leadership", value: "Leadership" },
          { title: "Science & Engineering", value: "Science & Engineering" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "image" },
  },
});
