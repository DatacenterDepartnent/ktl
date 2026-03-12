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
import SocialFeedDisplay from "@/components/home/SocialFeedDisplay";
import CalendarPage from "@/components/Calendar";
import QAPage from "./q-and-a/page";

// ✅ ตั้งค่าให้ดึงข้อมูลใหม่เสมอ ไม่ทำ Static เพื่อให้ข้อมูลหน้าบ้านตรงกับ DB ตลอดเวลา
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * ดึงข้อมูล Social Feeds (YouTube/Facebook) จาก DB โดยตรง
 */
async function getFeeds() {
  try {
    const client = await clientPromise;
    const db = client.db("ktltc_db");

    // ดึงข้อมูลและเรียงลำดับจากใหม่ไปเก่า
    const feeds = await db
      .collection("feeds")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // ต้องทำการ Serialize ข้อมูลจาก MongoDB Object เป็น Plain JSON ก่อนส่งให้ Client Component
    return JSON.parse(JSON.stringify(feeds));
  } catch (error) {
    console.error("Direct DB Fetch Feeds Error:", error);
    return [];
  }
}

/**
 * ดึงข้อมูลการตั้งค่าการแสดงผลและข้อมูลเบื้องต้นจาก DB
 */
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
    console.error("Fetch Home Data Error:", error);
    return { isShow: {}, settings: {}, activePosters: [] };
  }
}

export default async function Home() {
  // ✅ ดึงข้อมูลแบบขนาน (Parallel) เพื่อความรวดเร็ว
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
            text1={settings.marquee_text_1 || "วิทยาลัยเทคนิคกันทรลักษ์"}
            text2={settings.marquee_text_2 || "Kantharalak Technical College"}
          />
        )}

        <div className="max-w-7xl mx-auto w-full px-4">
          {/* Posters / Background Effect */}
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

          {/* ข้อมูลข่าวสาร (เรียงตามที่จัดไว้เดิม) */}
          {isShow.press_release !== false && <PressRelease />}
          {isShow.newsletter !== false && <Newsletter />}
          {isShow.announcement !== false && <Announcement />}
          {isShow.tender !== false && <TenderPage />}
          {isShow.command !== false && <CommandPage />}
          {isShow.internship !== false && <InternshipPage />}

          {/* Facebook Widget */}
          {isShow.internship !== false && <ShowFacebook />}

          {/* ✅ Social Feed Display (YouTube/Facebook) */}
          {/* ปรับให้ส่งข้อมูล feeds เข้าไปเลย โดยให้ Component ภายในจัดการสถานะว่างเอง */}
          {isShow.social_feed !== false && (
            <div className="py-12">
              <SocialFeedDisplay feeds={feeds} />
            </div>
          )}

          {/* Q&A Section */}
          {isShow.q_and_a !== false && (
            <div className="py-6">
              <QAPage />
            </div>
          )}

          {/* Calendar Section */}
          {isShow.calendar !== false && (
            <div className="py-12">
              <CalendarPage />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
