import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  // Strongly suggests singleton-ness; the desk structure also pins this
  // document so editors never see "create new" for it.
  fields: [
    defineField({
      name: "title",
      type: "string",
      hidden: true,
      initialValue: "Site Settings",
    }),

    defineField({
      name: "emailAddresses",
      title: "Email addresses",
      description:
        "Listed in the Footer. Pages also pick the matching label — 'Careers' for the careers page, 'Partnerships' for the partner page, 'Research' for the research page. The first entry is treated as the primary contact.",
      type: "array",
      of: [
        {
          type: "object",
          name: "emailEntry",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                "e.g. General, Partnerships, Careers, Research. Used to match emails to the right page.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "address",
              title: "Address",
              type: "string",
              description: "Full address, e.g. hello@indiskaai.com",
              validation: (r) =>
                r.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
                  name: "email",
                  invert: false,
                }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "address" },
          },
        },
      ],
    }),

    defineField({
      name: "officeAddress",
      title: "Office address",
      description: "Multi-line. Newlines are preserved in the footer.",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "addressLink",
      title: "Address link (Google Maps URL)",
      description:
        "Optional. If set, the footer office address becomes a clickable link to this URL.",
      type: "url",
    }),

    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. LinkedIn, X / Twitter, Careers, Substack.",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),

    defineField({
      name: "careersStatus",
      title: "Careers status",
      description:
        "Optional badge text shown next to the Careers link in the nav (e.g. 'Hiring', 'Coming soon'). Leave blank to hide the badge.",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings", subtitle: "Footer, contact info, socials" };
    },
  },
});
