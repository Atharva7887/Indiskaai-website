/**
 * IndiskaAI's core service lines — antibody libraries, discovery, and
 * engineering. Shared by the Nav "Services" dropdown, the /services hub
 * page, and the individual /services/[slug] detail pages so there's a
 * single source of truth for titles, slugs, and copy.
 */
export type ServiceEntry = {
  slug: string;
  title: string;
  /** Short line — used on cards, the nav dropdown tooltip, and the homepage teaser. */
  summary: string;
  /** Full description — used on the detail page. */
  description: string;
  /** Supporting photo for the hub card and detail-page header. */
  image: string;
  imageAlt: string;
  /**
   * True for entries that are an engagement/commercial model (e.g.
   * dedicated, partner-exclusive resources) rather than a distinct
   * product or process. Per a competitive review (Adimab splits
   * "Capabilities" from "Partnering" the same way), these render in
   * their own group on the /services hub instead of blending into the
   * core capability grid.
   */
  isEngagementModel?: boolean;
};

export const SERVICES: ServiceEntry[] = [
  {
    slug: "antibody-libraries",
    title: "Antibody Libraries",
    summary:
      "High-quality antibody libraries built for efficient, reliable discovery.",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1600",
    imageAlt: "Pipette dispensing sample into a multi-well antibody library plate",
    description:
      "IndiskaAI develops high-quality antibody libraries designed to support efficient and reliable antibody discovery. Our library development approach focuses on generating diverse antibody repertoires with carefully designed sequences and formats suitable for screening and selection. By combining molecular biology expertise, advanced sequencing technologies, and data-driven quality assessment, we aim to provide libraries that deliver meaningful diversity and robust performance. Our antibody library solutions can support different research requirements and discovery workflows, helping researchers identify promising candidates more efficiently. We also work with partners to develop customized libraries based on specific targets, formats, and project objectives. Through scientific innovation and rigorous quality control, IndiskaAI enables researchers to access advanced antibody library technologies for next-generation therapeutic and biotechnology research.",
  },
  {
    slug: "antibody-discovery",
    title: "Antibody Discovery",
    summary:
      "Advanced discovery solutions to identify promising candidates against challenging targets.",
    image:
      "https://images.unsplash.com/photo-1624957485560-47747511b32f?auto=format&fit=crop&q=80&w=1600",
    imageAlt: "Scientist holding a multi-well screening plate up to the light",
    description:
      "IndiskaAI provides advanced antibody discovery solutions designed to help researchers identify promising antibody candidates against challenging targets. Our discovery approach integrates antibody libraries, screening technologies, molecular biology, sequencing, and computational analysis to support efficient candidate identification and characterization. We focus on generating antibodies with desirable properties such as target specificity, binding activity, and developability potential. Our flexible discovery solutions can be adapted to different research objectives and project requirements, from early-stage candidate identification to downstream characterization and optimization. By combining scientific expertise with modern discovery technologies, we aim to reduce development complexity and accelerate the journey from target selection to promising antibody candidates. Our collaborative approach enables biotechnology and pharmaceutical partners to access tailored antibody discovery capabilities.",
  },
  {
    slug: "ai-antibody-data-packages",
    title: "AI Antibody Data Packages",
    summary:
      "AI-driven antibody data solutions for better-informed discovery decisions.",
    image:
      "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&q=80&w=1600",
    imageAlt: "Two scientists reviewing computational data on monitors",
    description:
      "IndiskaAI develops AI-driven antibody data solutions that help researchers make better-informed decisions throughout antibody discovery and engineering. Our AI Antibody Data Packages combine antibody sequence information, computational analysis, and data-driven insights to support the evaluation and prioritization of antibody candidates. Advanced computational approaches can help researchers explore antibody diversity, identify patterns, assess candidate characteristics, and generate actionable insights from complex datasets. These solutions are designed to complement experimental workflows and improve the efficiency of antibody research. We work toward integrating artificial intelligence with antibody engineering to enable faster, more informed discovery and development processes. Our data-focused approach supports researchers and biotechnology partners seeking innovative computational capabilities for modern antibody discovery and therapeutic development.",
  },
  {
    slug: "rd-services",
    title: "R&D Services",
    summary:
      "Customized research and development across antibody engineering and optimization.",
    image:
      "https://images.unsplash.com/photo-1631556759511-6ce895fbf0ad?auto=format&fit=crop&q=80&w=1600",
    imageAlt: "Three scientists in lab coats reviewing results together",
    description:
      "IndiskaAI offers customized research and development services focused on antibody engineering, discovery, optimization, and biotechnology innovation. Our R&D capabilities combine molecular biology, antibody engineering, sequencing, computational analysis, and scientific research to address complex project requirements. We work closely with our partners to understand their objectives and develop practical research strategies tailored to specific targets, antibody formats, and development challenges. Our collaborative approach supports projects across different stages of research, from early concept development and candidate identification to characterization and optimization. We continuously explore emerging technologies and methodologies to improve antibody discovery workflows and develop innovative solutions. With a strong focus on scientific quality, flexibility, and collaboration, IndiskaAI helps research organizations advance promising ideas toward meaningful biotechnology outcomes.",
  },
  {
    slug: "reagents",
    title: "Reagents",
    summary:
      "Research-focused reagent solutions for antibody and life-science workflows.",
    image:
      "https://images.unsplash.com/photo-1634872583967-6417a8638a59?auto=format&fit=crop&q=80&w=1600",
    imageAlt: "Gloved hand holding a rack of small reagent vials",
    description:
      "IndiskaAI provides research-focused reagent solutions designed to support antibody discovery, engineering, validation, and broader life science workflows. Reliable reagents are an essential component of successful laboratory research, and our solutions are developed with a focus on consistency, quality, and suitability for demanding research applications. We aim to support scientists and research organizations with products that can integrate effectively into their experimental workflows. Our reagent capabilities complement our broader antibody discovery and engineering services, providing partners with access to resources that support different stages of research and development. We continuously work to expand our portfolio and explore new solutions that address evolving laboratory requirements. Through quality-focused development and scientific expertise, IndiskaAI strives to provide dependable reagent solutions for biotechnology, pharmaceutical, and academic research applications.",
  },
  {
    slug: "exclusive-libraries",
    title: "Exclusive Libraries",
    summary:
      "Dedicated, differentiated library resources built around your discovery program.",
    image:
      "https://images.unsplash.com/photo-1624957866311-a58983bc5b2d?auto=format&fit=crop&q=80&w=1600",
    imageAlt: "Scientist retrieving a labeled sample from dedicated library storage",
    isEngagementModel: true,
    description:
      "IndiskaAI develops exclusive antibody libraries designed to provide partners with dedicated and differentiated resources for their discovery programs. Each exclusive library can be developed around specific research objectives, target requirements, antibody formats, and desired diversity characteristics. Our approach combines antibody engineering expertise, molecular biology, sequencing, and comprehensive quality assessment to support the development of high-value library resources. Exclusive libraries can provide researchers with dedicated discovery capabilities and greater flexibility when pursuing specific therapeutic or research targets. We collaborate closely with partners throughout the design and development process to ensure that the resulting library aligns with their scientific requirements. By delivering customized and innovative antibody library solutions, IndiskaAI aims to create valuable discovery resources that support long-term research and next-generation antibody development programs.",
  },
];

export function getService(slug: string): ServiceEntry | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** The five product/process capabilities — what we build. */
export const CORE_SERVICES = SERVICES.filter((s) => !s.isEngagementModel);
/** Engagement/commercial models — how a partner can access the work. */
export const ENGAGEMENT_MODELS = SERVICES.filter((s) => s.isEngagementModel);
