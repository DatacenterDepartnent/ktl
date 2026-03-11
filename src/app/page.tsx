import clientPromise from "@/lib/db";
import HomeBannerSwiper from "@/components/HomeBannerSwiper";
import StudentSupportSystem from "./StudentSupportSystem/page";
import ExternalQualityAssurance from "./ExternalQualityAssurance";
import Features from "./Features";
import WelcomePage from "@/components/WelcomePage";
import ScrollVelocity from "@/components/Scrollvelocity";
import BackgroundBeamsWithCollisionDemo from "@/components/BackgroundBeamsWithCollisionDemo";
import PressRelease from "./pressrelease/page";
import Newsletter from "./newsletter/page";
import Announcement from "./announcement/page";
import TenderPage from "./tender/page";
import CommandPage from "./command/page";
import InternshipPage from "./internship/page";
import ShowFacebook from "@/components/ShowFacebook";
import ShowYoutube from "./ShowYoutube/page";
import CalendarPage from "@/components/Calendar";
import SubQAPage from "./ITA/08/qa/SubQAPage";

// ดึงข้อมูลการตั้งค่าและข้อมูลโปสเตอร์ทั้งหมดที่ Active
async function getHomeData() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const [visibilityData, siteData, postersData] = await Promise.all([
      db.collection("home_settings").find().toArray(),
      db.collection("site_settings").find().toArray(),
      // แก้ไข: เอา .limit(1) ออก เพื่อดึงทุกอันที่เปิดใช้งาน
      db
        .collection("posters")
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .toArray(),
    ]);

    const isShow = visibilityData.reduce((acc: any, item: any) => {
      acc[item.componentId] = item.isVisible;
      return acc;
    }, {});

    const settings = siteData.reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    // เปลี่ยนชื่อตัวแปรให้เป็นพหูพจน์เพื่อให้เข้าใจง่าย (เป็น Array แล้ว)
    const activePosters = postersData || [];

    return { isShow, settings, activePosters };
  } catch (error) {
    console.error("Fetch Data Error:", error);
    return { isShow: {}, settings: {}, activePosters: [] };
  }
}

export default async function Home() {
  const { isShow, settings, activePosters } = await getHomeData();

  return (
    <div className="flex flex-col">
      <main className="grow">
        {/* Banner Section */}
        {isShow.banner !== false && <HomeBannerSwiper />}

        <div className="max-w-7xl mx-auto w-full">
          {isShow.student_support !== false && <StudentSupportSystem />}
          {isShow.qa_ita !== false && <ExternalQualityAssurance />}
          {isShow.features !== false && <Features />}
          {isShow.welcome !== false && (
            <div className="py-6">
              <WelcomePage />
            </div>
          )}
        </div>

        {/* Marquee Section */}
        {isShow.scroll_velocity !== false && (
          <ScrollVelocity
            text1={settings.marquee_text_1}
            text2={settings.marquee_text_2}
          />
        )}

        <div className="max-w-7xl mx-auto w-full">
          {/* ส่วนประชาสัมพันธ์หลัก (Posters) - แก้ไขให้วนลูปแสดงผล */}
          {isShow.background_effect !== false && activePosters.length > 0 && (
            <div className="flex flex-col gap-10 my-10">
              {activePosters.map((poster: any) => (
                <BackgroundBeamsWithCollisionDemo
                  key={poster._id.toString()}
                  data={poster}
                />
              ))}
            </div>
          )}

          {/* ข่าวสารและส่วนอื่นๆ */}
          {isShow.press_release !== false && <PressRelease />}
          {isShow.newsletter !== false && <Newsletter />}
          {isShow.announcement !== false && <Announcement />}
          {isShow.tender !== false && <TenderPage />}
          {isShow.command !== false && <CommandPage />}
          {isShow.internship !== false && <InternshipPage />}

          {/* Social Media & Calendar */}
          {isShow.facebook_feed !== false && (
            <div className="px-4">
              <ShowFacebook />
            </div>
          )}
          {isShow.youtube_feed !== false && (
            <div className="py-6 px-4">
              <ShowYoutube />
            </div>
          )}
          {isShow.calendar !== false && (
            <div className="py-6">
              <CalendarPage />
            </div>
          )}
          {isShow.sub_qa !== false && <SubQAPage />}
        </div>
      </main>
    </div>
  );
}
