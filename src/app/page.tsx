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
import SocialFeedDisplay from "@/components/home/SocialFeedDisplay";
// ✅ 1. Import หน้า Q&A มาใช้งาน (หรือจะสร้าง Component แยกก็ได้)
import QAPage from "./q-and-a/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const [homeData, feeds] = await Promise.all([getHomeData(), getFeeds()]);
  const { isShow, settings, activePosters } = homeData;

  return (
    <div className="flex flex-col">
      <main className="grow">
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

        {isShow.scroll_velocity !== false && (
          <ScrollVelocity
            text1={settings.marquee_text_1}
            text2={settings.marquee_text_2}
          />
        )}

        <div className="max-w-7xl mx-auto w-full">
          {isShow.background_effect !== false && activePosters.length > 0 && (
            <div className="flex flex-col gap-10 my-10 px-4">
              {activePosters.map((poster: any) => (
                <BackgroundBeamsWithCollisionDemo
                  key={poster._id.toString()}
                  data={poster}
                />
              ))}
            </div>
          )}

          {isShow.press_release !== false && <PressRelease />}
          {isShow.newsletter !== false && <Newsletter />}
          {isShow.announcement !== false && <Announcement />}
          {isShow.tender !== false && <TenderPage />}
          {isShow.command !== false && <CommandPage />}
          {isShow.internship !== false && <InternshipPage />}
          {isShow.internship !== false && <ShowFacebook />}

          {isShow.social_feed !== false && feeds.length > 0 && (
            <div className="py-12">
              <SocialFeedDisplay feeds={feeds} />
            </div>
          )}

          {/* --- ✅ ส่วน Q&A ใหม่ที่เพิ่มเข้าไป --- */}
          {isShow.q_and_a !== false && (
            <div className="">
              <QAPage />
            </div>
          )}

          {isShow.calendar !== false && (
            <div className="py-12">
              <CalendarPage />
            </div>
          )}

          {/* {isShow.sub_qa !== false && <SubQAPage />} */}
        </div>
      </main>
    </div>
  );
}
