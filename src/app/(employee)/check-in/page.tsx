'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Camera, MapPin, ScanFace, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';
import { uploadToCloudinary } from '@/lib/upload';

function CheckInContent() {
  const router = useRouter();
  // Safe use of searchParams with Suspense boundary fallback.
  const searchParams = useSearchParams();
  const actionType = searchParams.get('action') || 'in';
  const isCheckIn = actionType === 'in';

  const [time, setTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("GPS error", err),
        { enableHighAccuracy: true }
      );
    }
  };

  const openCameraForAction = async () => {
    setIsCameraOpen(true);
    setStatusMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      getLocation();
    } catch (err: any) {
      console.error("Accessing camera failed", err);
      if (err.name === 'NotReadableError') {
         alert("กล้องถูกใช้งานโดยแอปพลิเคชันอื่นอยู่ กรุณาปิดการใช้งานกล้องในแอปเหล่านั้นก่อนครับ");
      } else if (err.name === 'NotAllowedError') {
         alert("คุณบล็อกการอนุญาตเข้าถึงกล้อง กรุณาอณุญาตกล้องในเบราว์เซอร์");
      } else {
         alert("ไม่พบกล้องหรือไม่สามารถเข้าถึงได้");
      }
      setIsCameraOpen(false);
    }
  };

  const submitAttendance = async () => {
    setIsProcessing(true);
    try {
      let cloudinaryUrl = "https://example.com/dummy-photo.jpg";

      // 1. Capture Image directly from video element
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
          
          if (blob) {
            // 2. Compress the image locally
            const imageFile = new File([blob], "attendance-photo.jpg", { type: "image/jpeg" });
            const options = {
              maxSizeMB: 0.1, // Compress heavily to under 100KB for speed
              maxWidthOrHeight: 800, // Reduced resolution for lighter uploads
              useWebWorker: true,
            };
            const compressedFile = await imageCompression(imageFile, options);

            // 3. Upload the compressed image to Cloudinary
            const uploadedUrl = await uploadToCloudinary(compressedFile, "attendance_photos");
            if (uploadedUrl) {
              cloudinaryUrl = uploadedUrl;
            } else {
              console.warn("Failed to upload to Cloudinary. Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set.");
              alert("คำเตือน: อัปโหลดรูปภาพไม่สำเร็จ (อาจลืมตั้งค่า Cloudinary ใน .env) ระบบจะใช้รูปภาพจำลองแทน");
            }
          }
        }
      }

      const payload = {
        lat: location?.lat,
        lng: location?.lng,
        photoUrl: cloudinaryUrl,
        deviceId: "device-12345",
        address: "Location Address"
      };

      const endpoint = isCheckIn ? '/api/attendance/check-in' : '/api/attendance/check-out';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg(isCheckIn ? 'บันทึกเวลาเข้างานเรียบร้อยแล้ว!' : 'บันทึกเวลาออกงานเรียบร้อยแล้ว!');
        setIsCameraOpen(false);
        if (videoRef.current && videoRef.current.srcObject) {
           const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
           tracks.forEach(t => t.stop());
        }
      } else {
        alert("ทำรายการไม่สำเร็จ: " + data.message);
      }
    } catch (e) {
      console.error(e);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelAction = () => {
    setIsCameraOpen(false);
    if (videoRef.current && videoRef.current.srcObject) {
       const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
       tracks.forEach(t => t.stop());
    }
  };

  return (
    <div className={`min-h-screen ${isCheckIn ? 'bg-green-50' : 'bg-orange-50'} flex flex-col items-center py-6 px-4 font-sans text-slate-800 transition-colors duration-500`}>
      
      {/* Top Nav */}
      <div className="w-full max-w-sm flex items-center mb-6">
        <Link href="/wfh" onClick={cancelAction} className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft size={24} />
        </Link>
        <span className="ml-4 font-bold text-lg text-slate-700">{isCheckIn ? 'ยืนยันลงเวลาเข้างาน' : 'ยืนยันลงเวลาออกงาน'}</span>
      </div>

      {statusMsg && (
        <div className={`mb-6 w-full max-w-sm px-6 py-8 bg-white ${isCheckIn ? 'text-green-600 border-green-200' : 'text-orange-600 border-orange-200'} rounded-3xl flex flex-col items-center justify-center shadow-lg border-2 text-center space-y-4`}>
          <CheckCircle size={56} className={`${isCheckIn ? 'text-green-500' : 'text-orange-500'}`} />
          <span className="font-bold text-2xl text-slate-800">{statusMsg}</span>
          <p className="text-slate-500 font-mono text-xl">{mounted ? time.toLocaleTimeString('th-TH') : ''}</p>
          <Link href="/wfh" className="mt-6 px-8 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition text-lg w-full">
            กลับหน้าหลัก
          </Link>
        </div>
      )}

      {/* Main Container */}
      {!statusMsg && (
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
           {!isCameraOpen ? (
              <div className="p-8 flex flex-col items-center text-center">
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${isCheckIn ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'}`}>
                    <ScanFace size={48} />
                 </div>
                 <h3 className="font-bold text-2xl mb-2 text-slate-800">{isCheckIn ? 'ลงเวลาเข้างาน' : 'ลงเวลาออกงาน'}</h3>
                 <p className="text-slate-500 mb-8">ระบบต้องการถ่ายรูปใบหน้าเพื่อยืนยันพิกัด GPS ปัจจุบันของคุณ</p>
                 
                 <button 
                  onClick={openCameraForAction}
                  className={`w-full text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition flex justify-center items-center space-x-2 ${isCheckIn ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'}`}
                 >
                   <Camera size={24} />
                   <span>เปิดกล้องถ่ายรูป</span>
                 </button>
              </div>
           ) : (
              <div className="p-6 flex flex-col items-center">
                <div className="w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden relative mb-4 shadow-inner ring-4 ring-slate-100">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                    <ScanFace size={150} className="text-white" />
                  </div>
                </div>

                {location ? (
                  <div className={`w-full flex items-center justify-center space-x-2 text-sm font-medium p-3 rounded-xl mb-6 ${isCheckIn ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'} border`}>
                    <MapPin size={18} /><span>พบพิกัด GPS แล้ว</span>
                  </div>
                ) : (
                  <div className={`w-full flex items-center justify-center space-x-2 text-sm font-medium p-3 rounded-xl mb-6 bg-slate-50 text-slate-500 animate-pulse border border-slate-200`}>
                    <Loader2 size={18} className="animate-spin" /><span>กำลังค้นหาพิกัด...</span>
                  </div>
                )}

                <div className="w-full space-y-3">
                  <button 
                    onClick={submitAttendance}
                    disabled={isProcessing || !location}
                    className={`w-full text-white rounded-xl py-4 font-bold text-lg flex justify-center items-center shadow-md transition ${isProcessing || !location ? 'bg-slate-300 cursor-not-allowed' : (isCheckIn ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30')}`}
                  >
                    {isProcessing ? <><Loader2 className="animate-spin mr-2"/>กำลังบันทึกข้อมูล...</> : (isCheckIn ? 'บันทึกเข้างาน' : 'บันทึกออกงาน')}
                  </button>
                  
                  <button 
                    onClick={cancelAction}
                    className="w-full text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl py-3 font-bold transition"
                  >
                    ยกเลิกรูปถ่าย
                  </button>
                </div>
              </div>
           )}
        </div>
      )}

    </div>
  );
}

export default function UnifiedCheckInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading Configuration...</div>}>
      <CheckInContent />
    </Suspense>
  );
}
