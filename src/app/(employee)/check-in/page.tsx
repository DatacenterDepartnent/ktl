"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  ScanFace,
  CheckCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  ShieldX,
  AlertCircle,
  Scan,
  X,
  Navigation,
  Info,
} from "lucide-react";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { uploadToCloudinary } from "@/lib/upload";

type FaceStatus =
  | "idle"
  | "loading_models"
  | "loading_profile"
  | "no_profile"
  | "detecting"
  | "matched"
  | "not_matched"
  | "error";

function CheckInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionType = searchParams.get("action") || "in";
  const isCheckIn = actionType === "in";

  const [time, setTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "searching" | "found" | "error"
  >("idle");
  const [locationError, setLocationError] = useState("");
  const [faceStatus, setFaceStatus] = useState<FaceStatus>("idle");
  const [faceMsg, setFaceMsg] = useState("");
  const [recordedTime, setRecordedTime] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const faceApiRef = useRef<any>(null);
  const profileDescriptorRef = useRef<Float32Array | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadFaceApiAndProfile = async () => {
    try {
      setFaceStatus("loading_models");
      setFaceMsg("กำลังโหลดระบบตรวจสอบใบหน้า...");

      // Dynamic import เพื่อป้องกัน SSR error
      const faceApi = await import("@vladmandic/face-api");
      faceApiRef.current = faceApi;

      const MODEL_URL = "/models";
      await Promise.all([
        faceApi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      setFaceStatus("loading_profile");
      setFaceMsg("กำลังโหลดข้อมูลโปรไฟล์...");

      // ดึงรูปโปรไฟล์จาก API
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("ไม่สามารถโหลดโปรไฟล์ได้");
      const profile = await res.json();

      if (!profile.image) {
        setFaceStatus("no_profile");
        setFaceMsg("ไม่พบรูปโปรไฟล์ — ระบบข้ามการตรวจสอบใบหน้า");
        return;
      }

      // โหลดรูปโปรไฟล์และดึง descriptor
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = profile.image;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const detection = await faceApi
        .detectSingleFace(
          img,
          new faceApi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setFaceStatus("no_profile");
        setFaceMsg("ตรวจไม่พบใบหน้าในรูปโปรไฟล์ — ข้ามการตรวจสอบ");
        return;
      }

      profileDescriptorRef.current = detection.descriptor;
      setFaceStatus("detecting");
      setFaceMsg("กำลังตรวจสอบใบหน้า...");

      // เริ่ม Real-time detection
      startLiveDetection();
    } catch (err) {
      console.error("Face API Error:", err);
      setFaceStatus("error");
      setFaceMsg("โหลดระบบตรวจสอบใบหน้าไม่สำเร็จ — ข้ามการตรวจสอบ");
    }
  };

  const startLiveDetection = () => {
    if (detectionIntervalRef.current)
      clearInterval(detectionIntervalRef.current);

    detectionIntervalRef.current = setInterval(async () => {
      if (
        !videoRef.current ||
        !faceApiRef.current ||
        !profileDescriptorRef.current
      )
        return;
      if (videoRef.current.readyState < 2) return;

      try {
        const faceApi = faceApiRef.current;
        const detection = await faceApi
          .detectSingleFace(
            videoRef.current,
            new faceApi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const distance = faceApi.euclideanDistance(
            profileDescriptorRef.current,
            detection.descriptor,
          );
          if (distance <= 0.5) {
            setFaceStatus("matched");
            setFaceMsg(
              `✅ ยืนยันตัวตนสำเร็จ (ความแม่นยำ ${Math.round((1 - distance) * 100)}%)`,
            );
          } else {
            setFaceStatus("not_matched");
            setFaceMsg("❌ ใบหน้าไม่ตรงกับโปรไฟล์");
          }
        } else {
          setFaceStatus("detecting");
          setFaceMsg("ไม่พบใบหน้า — กรุณาหันหน้าเข้ากล้อง");
        }
      } catch {}
    }, 1500);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS");
      return;
    }
    setLocationStatus("searching");
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("found");
      },
      (err) => {
        setLocationStatus("error");
        if (err.code === 1)
          setLocationError(
            "กรุณาอนุญาตการเข้าถึงตำแหน่ง (Location Permission)",
          );
        else if (err.code === 2)
          setLocationError("ไม่สามารถระบุพิกัดได้ (อาจไม่มีสัญญาณ GPS)");
        else if (err.code === 3)
          setLocationError("ขอพิกัด GPS หมดเวลา (Timeout)");
        else setLocationError("เกิดข้อผิดพลาดในการโหลด GPS");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const openCameraForAction = async () => {
    setIsCameraOpen(true);
    setStatusMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      getLocation();
      {/* await loadFaceApiAndProfile(); */}
      setFaceStatus("idle"); // Disable face check logic
    } catch (err: any) {
      if (err.name === "NotReadableError") {
        alert(
          "กล้องถูกใช้งานโดยแอปอื่นอยู่ กรุณาปิดการใช้งานกล้องในแอปเหล่านั้นก่อน",
        );
      } else if (err.name === "NotAllowedError") {
        alert("คุณบล็อกการอนุญาตเข้าถึงกล้อง กรุณาอนุญาตกล้องในเบราว์เซอร์");
      } else {
        alert("ไม่พบกล้องหรือไม่สามารถเข้าถึงได้");
      }
      setIsCameraOpen(false);
    }
  };

  const cancelAction = () => {
    if (detectionIntervalRef.current)
      clearInterval(detectionIntervalRef.current);
    setIsCameraOpen(false);
    setFaceStatus("idle");
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
    }
  };

  // ตรวจสอบว่าสามารถลงเวลาได้หรือไม่
  const canSubmit = () => {
    // ปิดการตรวจสอบใบหน้าชั่วคราว (Disabled Face Check)
    return !!location && !isProcessing;
  };

  const submitAttendance = async () => {
    // ตรวจสอบใบหน้าก่อนส่ง (เข้มงวดเฉพาะ not_matched)
    if (faceStatus === "not_matched") {
      alert(
        "ไม่สามารถลงเวลาได้ เนื่องจากใบหน้าไม่ตรงกับโปรไฟล์ กรุณาลองใหม่อีกครั้ง",
      );
      return;
    }

    setIsProcessing(true);
    try {
      let cloudinaryUrl = "https://example.com/dummy-photo.jpg";

      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.9),
          );
          if (blob) {
            const imageFile = new File([blob], "attendance-photo.jpg", {
              type: "image/jpeg",
            });
            const options = {
              maxSizeMB: 0.1,
              maxWidthOrHeight: 800,
              useWebWorker: true,
            };
            const compressedFile = await imageCompression(imageFile, options);
            const uploadedUrl = await uploadToCloudinary(
              compressedFile,
              "attendance_photos",
            );
            if (uploadedUrl) cloudinaryUrl = uploadedUrl;
          }
        }
      }

      const payload = {
        lat: location?.lat,
        lng: location?.lng,
        photoUrl: cloudinaryUrl,
        deviceId: "device-12345",
        address: "Location Address",
        faceVerified: true, // Face check disabled by user request
      };

      const endpoint = isCheckIn
        ? "/api/attendance/check-in"
        : "/api/attendance/check-out";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (detectionIntervalRef.current)
          clearInterval(detectionIntervalRef.current);

        // บันทึกเวลาที่ลงสำเร็จ (จาก Server)
        const serverTimeStr = isCheckIn
          ? data.data.checkIn.time
          : data.data.checkOut.time;
        if (serverTimeStr) {
          setRecordedTime(
            new Date(serverTimeStr).toLocaleTimeString("th-TH", {
              timeZone: "Asia/Bangkok",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }),
          );
        }

        setStatusMsg(
          isCheckIn
            ? "บันทึกเวลาเข้างานเรียบร้อยแล้ว!"
            : "บันทึกเวลาออกงานเรียบร้อยแล้ว!",
        );
        setIsCameraOpen(false);
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (
            videoRef.current.srcObject as MediaStream
          ).getTracks();
          tracks.forEach((t) => t.stop());
        }

        // 🚀 Automatic Redirect for Check-Out
        if (!isCheckIn) {
          setTimeout(() => router.push("/work-report"), 3000);
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

  const getFaceStatusUI = () => {
    switch (faceStatus) {
      case "loading_models":
      case "loading_profile":
        return {
          icon: <Loader2 size={18} className="animate-spin" />,
          color: "bg-slate-50 text-slate-500 border-slate-200",
        };
      case "detecting":
        return {
          icon: <Loader2 size={18} className="animate-spin" />,
          color: "bg-blue-50 text-blue-600 border-blue-100",
        };
      case "matched":
        return {
          icon: <ShieldCheck size={18} />,
          color: "bg-green-50 text-green-700 border-green-200",
        };
      case "not_matched":
        return {
          icon: <ShieldX size={18} />,
          color: "bg-red-50 text-red-600 border-red-200",
        };
      case "no_profile":
      case "error":
        return {
          icon: <AlertCircle size={18} />,
          color: "bg-yellow-50 text-yellow-600 border-yellow-200",
        };
      default:
        return null;
    }
  };

  const faceStatusUI = getFaceStatusUI();
  const submitDisabled =
    isProcessing ||
    !location ||
    faceStatus === "not_matched" ||
    faceStatus === "loading_models" ||
    faceStatus === "loading_profile";

  const theme = isCheckIn
    ? {
        primary: "emerald",
        bg: "bg-emerald-50 dark:bg-emerald-950/20",
        accent: "text-emerald-500",
        btn: "bg-emerald-500 shadow-emerald-500/30",
      }
    : {
        primary: "rose",
        bg: "bg-rose-50 dark:bg-rose-950/20",
        accent: "text-rose-500",
        btn: "bg-rose-500 shadow-rose-500/30",
      };

  return (
    <div
      className={`min-h-screen ${theme.bg} py-6 px-2 font-sans transition-colors duration-700 overflow-hidden relative`}
    >
      {/* Background Blobs */}
      <div
        className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] ${isCheckIn ? "bg-emerald-500/10" : "bg-rose-500/10"} blur-[120px] rounded-full pointer-events-none`}
      />
      <div
        className={`fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${isCheckIn ? "bg-teal-500/10" : "bg-orange-500/10"} blur-[120px] rounded-full pointer-events-none`}
      />

      <div className="max-w-md mx-auto relative z-10">
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/wfh"
            onClick={cancelAction}
            className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-black/5 text-slate-400 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-white transition-all active:scale-95 border border-slate-100 dark:border-zinc-800"
          >
            <ArrowLeft size={22} />
          </Link>
          <div className="text-right">
            <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
              {isCheckIn ? "Check-In" : "Check-Out"}
            </h1>
            <p
              className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.accent}`}
            >
              {isCheckIn ? "ลงเวลาเข้างาน" : "ลงเวลาออกงาน"}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {statusMsg ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 flex flex-col items-center shadow-2xl shadow-black/10 border border-slate-100 dark:border-zinc-800 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 inset-x-0 h-1.5 ${isCheckIn ? "bg-emerald-500" : "bg-rose-500"}`}
              />

              <div
                className={`w-24 h-24 rounded-full ${isCheckIn ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-rose-50 dark:bg-rose-500/10"} flex items-center justify-center mb-8 relative`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                    delay: 0.2,
                  }}
                >
                  <CheckCircle size={56} className={theme.accent} />
                </motion.div>
                <div
                  className={`absolute inset-0 rounded-full border-2 ${isCheckIn ? "border-emerald-500" : "border-rose-500"} animate-ping opacity-20`}
                />
              </div>

              <h2 className="text-2xl font-black text-slate-800 dark:text-white text-center mb-2">
                {statusMsg}
              </h2>
              <div className="space-y-1 text-center mb-8">
                <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">
                  Recorded Completion Time
                </p>
                <p className="text-4xl font-black text-slate-800 dark:text-white font-mono uppercase">
                  {recordedTime ||
                    (mounted
                      ? time.toLocaleTimeString("th-TH", { hour12: false })
                      : "--:--")}
                </p>
              </div>

              <div className="w-full grid grid-cols-1 gap-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <Link
                  href={isCheckIn ? "/wfh" : "/work-report"}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-3xl font-black text-sm uppercase tracking-widest text-center shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isCheckIn ? "Return to Dashboard" : "Write Work Report"}
                </Link>
                {!isCheckIn && (
                  <p className="text-center text-[10px] text-blue-500 font-black uppercase tracking-widest animate-pulse">
                    Redirecting to Work Report in 3s...
                  </p>
                )}
                <p className="text-center text-[10px] text-slate-300 dark:text-zinc-600 font-bold uppercase tracking-[0.3em]">
                  KTL Attendance System v1.2
                </p>
              </div>
            </motion.div>
          ) : !isCameraOpen ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 flex flex-col items-center shadow-2xl shadow-black/10 border border-slate-100 dark:border-zinc-800 text-center"
            >
              <div
                className={`w-28 h-28 rounded-3xl ${isCheckIn ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" : "bg-rose-50 dark:bg-rose-500/10 text-rose-500"} flex items-center justify-center mb-8 shadow-inner border border-white dark:border-zinc-800 transition-transform duration-500 hover:rotate-6`}
              >
                <ScanFace size={60} />
              </div>

              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                {isCheckIn ? "ยืนยันใบหน้า" : "บันทึกเลิกงาน"}
              </h3>
              <p className="text-slate-400 dark:text-zinc-500 text-sm font-medium mb-10 max-w-[240px]">
                {isCheckIn
                  ? "ระบบจะทำการถ่ายรูปและบันทึกพิกัด GPS เพื่อยืนยันการเข้างาน"
                  : "บันทึกเวลาเลิกทำงานวันนี้ และอัปโหลดรูปภาพยืนยัน"}
              </p>

              <div className="w-full space-y-4">
                <button
                  onClick={openCameraForAction}
                  className={`w-full ${theme.btn} text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl`}
                >
                  <Camera size={20} />
                  <span>เปิดกล้องถ่ายรูป</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-zinc-600">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                    Security Verified Access
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 shadow-2xl shadow-black/10 border border-slate-100 dark:border-zinc-800"
            >
              {/* Video Feed Glass Container */}
              <div className="w-full aspect-4/5 bg-slate-900 rounded-4xl overflow-hidden relative mb-6 shadow-2xl border-4 border-slate-50 dark:border-zinc-800 group">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />

                {/* Scan Overlay UI */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[80%] h-[70%] border-2 border-dashed border-white/30 rounded-3xl relative">
                    <div
                      className={`absolute top-0 inset-x-0 h-1 bg-white/40 blur-sm animate-[scan_2s_infinite]`}
                    />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/80 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/80 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/80 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/80 rounded-br-xl" />
                  </div>
                </div>

                <div className="absolute bottom-4 inset-x-4">
                  {faceStatusUI && (
                    <div
                      className={`flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-2xl backdrop-blur-xl border ${faceStatusUI.color} shadow-2xl`}
                    >
                      {faceStatusUI.icon}
                      <span>{faceMsg}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-3 mb-8">
                {/* GPS Badge */}
                <div
                  className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${locationStatus === "found" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30" : "bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-800"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${locationStatus === "found" ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-zinc-700 text-slate-400"}`}
                    >
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                        Location Status
                      </p>
                      <p
                        className={`text-xs font-black uppercase ${locationStatus === "found" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}
                      >
                        {locationStatus === "found"
                          ? "พบพิกัดตำแหน่งแล้ว"
                          : locationStatus === "searching"
                            ? "กำลังค้นหาพิกัด..."
                            : "เกิดข้อผิดพลาดในการโหลด"}
                      </p>
                    </div>
                  </div>
                  {locationStatus === "found" ? (
                    <ShieldCheck size={20} className="text-emerald-500" />
                  ) : (
                    <button
                      onClick={getLocation}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                    >
                      <Navigation size={18} />
                    </button>
                  )}
                </div>

                {locationStatus === "error" && (
                  <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-[10px] font-black uppercase rounded-xl flex items-center gap-2">
                    <Info size={12} /> {locationError}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={submitAttendance}
                  disabled={submitDisabled}
                  className={`w-full h-16 rounded-3xl font-black text-sm uppercase tracking-widest flex justify-center items-center gap-3 transition-all ${submitDisabled ? "bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-not-allowed" : `${theme.btn} text-white hover:scale-[1.02] active:scale-[0.98] shadow-2xl`}`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />{" "}
                      PROCESSING...
                    </>
                  ) : isCheckIn ? (
                    "Punch-In Now"
                  ) : (
                    "Punch-Out Now"
                  )}
                </button>

                <button
                  onClick={cancelAction}
                  className="w-full py-4 text-slate-400 dark:text-zinc-600 font-black text-[10px] uppercase tracking-[0.3em] hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    <X size={14} /> Cancel Action
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          @keyframes scan {
            0% {
              top: 0%;
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              top: 100%;
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function UnifiedCheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading Configuration...
        </div>
      }
    >
      <CheckInContent />
    </Suspense>
  );
}
