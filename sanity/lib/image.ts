import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "./client";

const builder = projectId
  ? imageUrlBuilder({ projectId, dataset })
  : null;

export function urlForImage(source: { asset?: { _ref?: string } } | null | undefined) {
  if (!builder || !source?.asset?._ref) return null;
  return builder.image(source);
}
