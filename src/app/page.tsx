import ScrollUp from "@/components/Common/ScrollUp";
import Announcement from "./announcement/page";
import Newsletter from "./newsletter/page";
import PressRelease from "./pressrelease/page";
import Scrollimage from "@/components/Scrollimage";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow">
        <ScrollUp />
        <Scrollimage />
        <PressRelease />
        <Newsletter />
        <Announcement />
      </main>
    </div>
  );
}
