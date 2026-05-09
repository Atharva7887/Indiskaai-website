import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain">
      <SmoothScroll>
        <Nav />
        {children}
        <Footer />
      </SmoothScroll>
    </div>
  );
}
