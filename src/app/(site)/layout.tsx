import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSiteSettings } from "../../../sanity/lib/fetch";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="grain">
      <SmoothScroll>
        <Nav careersStatus={settings.careersStatus} />
        {children}
        <Footer settings={settings} />
      </SmoothScroll>
    </div>
  );
}
