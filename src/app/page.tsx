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

// --- Main Home Component ---
// หน้าแรกของเว็บไซต์: ทำหน้าที่รวม Component ย่อยๆ มาแสดงผลเรียงกันในแนวตั้ง
export default function Home() {
  return (
    // Container หลัก ใช้ Flex Column เพื่อเรียงเนื้อหาจากบนลงล่าง
    <div className="flex flex-col">
      <main className="grow">

        {/* 2. Scroll Image: ส่วนแสดงรูปภาพสไลด์ หรือ Banner หลักด้านบน */}
        <div className="max-w-7xl mx-auto">
          <Scrollimage />
        </div>

        {/* 3. Student Support: ระบบดูแลช่วยเหลือผู้เรียน */}
        <div className="max-w-7xl mx-auto">
          <StudentSupportSystem />
        </div>

        {/* 4. QA / ITA: ส่วนการประกันคุณภาพภายนอก และการประเมินคุณธรรม (ITA) */}
        <div className="max-w-7xl mx-auto">
          <ExternalQualityAssurance />
        </div>

        {/* 5. Features: เมนูลัด หรือฟีเจอร์เด่นของวิทยาลัย (เช่น ศูนย์ราชการสะดวก, สมัครเรียน) */}
        <div className="max-w-7xl mx-auto">
          <Features />
        </div>

        {/* 6. Welcome: ข้อความต้อนรับจากผู้อำนวยการ หรือข้อมูลวิสัยทัศน์ */}
        <div className="py-6 max-w-7xl mx-auto">
          <WelcomePage />
        </div>

        {/* 7. Scroll Velocity: ข้อความวิ่ง (Marquee) เพื่อความสวยงามหรือประกาศด่วน */}
        <div className="py-6 max-w-7xl mx-auto">
          <ScrollVelocity />
        </div>

        {/* 8. Background Effect: ส่วนตกแต่งพิเศษ (Beams/Collision) อาจเป็นส่วนไว้อาลัยหรือแบนเนอร์พิเศษ */}
        <div className="max-w-7xl mx-auto">
          <BackgroundBeamsWithCollisionDemo />
        </div>

        {/* 9. Press Release: ข่าวประชาสัมพันธ์ล่าสุด */}
        <div className="max-w-7xl mx-auto">
          <PressRelease />
        </div>

        {/* 10. Newsletter: จดหมายข่าวประจำเดือน */}
        <div className="max-w-7xl mx-auto">
          <Newsletter />
        </div>

        {/* 11. Announcement: ข่าวประกาศทั่วไป (เช่น ประกาศสอบ, ประกาศหยุดเรียน) */}
        <div className="max-w-7xl mx-auto">
          <Announcement />
        </div>

        {/* 12. Facebook Feed: แสดงโพสต์จากหน้าเพจ Facebook ของวิทยาลัย */}
        <div className="px-4 max-w-7xl mx-auto">
          <ShowFacebook />
        </div>

        {/* 13. YouTube Feed: แสดงวิดีโอจากช่อง YouTube */}
        <div className="py-6 px-4 max-w-7xl mx-auto">
          <ShowYoutube />
        </div>

        {/* 14. Calendar: ปฏิทินกิจกรรมของวิทยาลัย */}
        <div className="py-6 max-w-7xl mx-auto">
          <CalendarPage />
        </div>

        {/* 15. Q&A / SubQA: กระดานถาม-ตอบ หรือส่วนรับฟังความคิดเห็น */}
        <div className="max-w-7xl mx-auto">
          <SubQAPage />
        </div>
      </main>
    </div>
  );
}
