import { groq } from "next-sanity";

export const TEAM_QUERY = groq`*[_type == "teamMember"] | order(order asc, _createdAt asc){
  _id,
  name,
  role,
  bio,
  accent,
  group,
  order,
  image
}`;

export const CAPABILITIES_QUERY = groq`*[_type == "capability"] | order(order asc, _createdAt asc){
  _id,
  title,
  description,
  icon,
  tags,
  order
}`;

export const STATS_QUERY = groq`*[_type == "stat"] | order(order asc, _createdAt asc){
  _id,
  value,
  label,
  order
}`;

export const RESEARCH_QUERY = groq`*[_type == "researchEntry"] | order(featured desc, date desc, order asc, _createdAt desc){
  _id,
  title,
  authors,
  abstract,
  category,
  date,
  venue,
  featured,
  "pdfUrl": coalesce(pdfFile.asset->url, pdfUrl)
}`;
