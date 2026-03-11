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
import ShowFacebook from "@/components/ShowFacebook"; // Component เดิม (ถ้ามี)
import ShowYoutube from "./ShowYoutube/page"; // Component เดิม (ถ้ามี)
import CalendarPage from "@/components/Calendar";
import SubQAPage from "./ITA/08/qa/SubQAPage";
import SocialFeedDisplay from "@/components/home/SocialFeedDisplay"; // ✅ นำเข้าตัวใหม่

// ✅ 1. ฟังก์ชันดึง Social Feeds จาก API
async function getFeeds() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/feeds`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Fetch Feeds Error:", error);
    return [];
  }
}

// ✅ 2. ดึงข้อมูล Home Data (คงเดิมของคุณไว้)
async function getHomeData() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    const [visibilityData, siteData, postersData] = await Promise.all([
      db.collection("home_settings").find().toArray(),
      db.collection("site_settings").find().toArray(),
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

    const activePosters = postersData || [];

    return { isShow, settings, activePosters };
  } catch (error) {
    console.error("Fetch Data Error:", error);
    return { isShow: {}, settings: {}, activePosters: [] };
  }
}

export default async function Home() {
  // ดึงข้อมูลทั้งสองส่วนพร้อมกัน
  const [homeData, feeds] = await Promise.all([getHomeData(), getFeeds()]);

  const { isShow, settings, activePosters } = homeData;

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

        <div className="max-w-7xl mx-auto w-full px-4">
          {/* ส่วนประชาสัมพันธ์หลัก (Posters) */}
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
          {isShow.internship !== false && <ShowFacebook />}
          {/* {isShow.internship !== false && <ShowYoutube />} */}

          {/* --- ✅ ส่วน Social Feed ใหม่ที่เชื่อมกับ Dashboard --- */}
          {isShow.social_feed !== false && feeds.length > 0 && (
            <div className="py-12">
              <SocialFeedDisplay feeds={feeds} />
            </div>
          )}

          {/* ปฏิทินกิจกรรม */}
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
