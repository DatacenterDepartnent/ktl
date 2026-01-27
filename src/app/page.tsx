import ScrollUp from "@/components/Common/ScrollUp";
import Announcement from "./announcement/page";
import Newsletter from "./newsletter/page";
import PressRelease from "./pressrelease/page";
import Scrollimage from "@/components/Scrollimage";
import StudentSupportSystem from "./StudentSupportSystem/page";
import ExternalQualityAssurance from "./ExternalQualityAssurance";
import Features from "./Features";
import WelcomePage from "@/components/WelcomePage";
import ScrollVelocity from "@/components/Scrollvelocity";
import BackgroundBeamsWithCollisionDemo from "@/components/BackgroundBeamsWithCollisionDemo";
import ShowFacebook from "@/components/ShowFacebook";
import CalendarPage from "@/components/Calendar";
import ShowYoutube from "./ShowYoutube/page";
import SubQAPage from "./ITA/08/qa/SubQAPage";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow ">
        <div className=" ">
          <ScrollUp />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <Scrollimage />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <StudentSupportSystem />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <ExternalQualityAssurance />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <Features />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <WelcomePage />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <ScrollVelocity />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <BackgroundBeamsWithCollisionDemo />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <PressRelease />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <Newsletter />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <Announcement />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <ShowFacebook />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <ShowYoutube />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <CalendarPage />
        </div>
        <div className="py-6 max-w-7xl mx-auto">
          <SubQAPage />
        </div>
      </main>
    </div>
  );
}
