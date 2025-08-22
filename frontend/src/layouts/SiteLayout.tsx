import { Outlet } from "react-router-dom";
import Navbar from "../sections/Navbar";
import Footer from "../sections/Footer";

export default function SiteLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
