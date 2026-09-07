import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { getSiteSettings } from "../../../sanity/lib/fetch";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="grain flex flex-col min-h-screen">
      <SmoothScroll>
        <Nav careersStatus={settings.careersStatus} />
        <PageTransition>{children}</PageTransition>
        <Footer settings={settings} />
      </SmoothScroll>
    </div>
  );
}
