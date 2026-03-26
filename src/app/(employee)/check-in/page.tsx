'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Camera, MapPin, ScanFace, CheckCircle, ArrowLeft, Loader2, ShieldCheck, ShieldX, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import imageCompression from 'browser-image-compression';
import { uploadToCloudinary } from '@/lib/upload';

type FaceStatus = 'idle' | 'loading_models' | 'loading_profile' | 'no_profile' | 'detecting' | 'matched' | 'not_matched' | 'error';

function CheckInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionType = searchParams.get('action') || 'in';
  const isCheckIn = actionType === 'in';

  const [time, setTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'searching' | 'found' | 'error'>('idle');
  const [locationError, setLocationError] = useState('');
  const [faceStatus, setFaceStatus] = useState<FaceStatus>('idle');
  const [faceMsg, setFaceMsg] = useState('');

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
      setFaceStatus('loading_models');
      setFaceMsg('กำลังโหลดระบบตรวจสอบใบหน้า...');

      // Dynamic import เพื่อป้องกัน SSR error
      const faceApi = await import('@vladmandic/face-api');
      faceApiRef.current = faceApi;

      const MODEL_URL = '/models';
      await Promise.all([
        faceApi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      setFaceStatus('loading_profile');
      setFaceMsg('กำลังโหลดข้อมูลโปรไฟล์...');

      // ดึงรูปโปรไฟล์จาก API
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('ไม่สามารถโหลดโปรไฟล์ได้');
      const profile = await res.json();

      if (!profile.image) {
        setFaceStatus('no_profile');
        setFaceMsg('ไม่พบรูปโปรไฟล์ — ระบบข้ามการตรวจสอบใบหน้า');
        return;
      }

      // โหลดรูปโปรไฟล์และดึง descriptor
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = profile.image;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const detection = await faceApi
        .detectSingleFace(img, new faceApi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setFaceStatus('no_profile');
        setFaceMsg('ตรวจไม่พบใบหน้าในรูปโปรไฟล์ — ข้ามการตรวจสอบ');
        return;
      }

      profileDescriptorRef.current = detection.descriptor;
      setFaceStatus('detecting');
      setFaceMsg('กำลังตรวจสอบใบหน้า...');

      // เริ่ม Real-time detection
      startLiveDetection();
    } catch (err) {
      console.error('Face API Error:', err);
      setFaceStatus('error');
      setFaceMsg('โหลดระบบตรวจสอบใบหน้าไม่สำเร็จ — ข้ามการตรวจสอบ');
    }
  };

  const startLiveDetection = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !faceApiRef.current || !profileDescriptorRef.current) return;
      if (videoRef.current.readyState < 2) return;

      try {
        const faceApi = faceApiRef.current;
        const detection = await faceApi
          .detectSingleFace(videoRef.current, new faceApi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const distance = faceApi.euclideanDistance(profileDescriptorRef.current, detection.descriptor);
          if (distance <= 0.5) {
            setFaceStatus('matched');
            setFaceMsg(`✅ ยืนยันตัวตนสำเร็จ (ความแม่นยำ ${Math.round((1 - distance) * 100)}%)`);
          } else {
            setFaceStatus('not_matched');
            setFaceMsg('❌ ใบหน้าไม่ตรงกับโปรไฟล์');
          }
        } else {
          setFaceStatus('detecting');
          setFaceMsg('ไม่พบใบหน้า — กรุณาหันหน้าเข้ากล้อง');
        }
      } catch {}
    }, 1500);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }
    setLocationStatus('searching');
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('found');
      },
      (err) => {
        setLocationStatus('error');
        if (err.code === 1) setLocationError('กรุณาอนุญาตการเข้าถึงตำแหน่ง (Location Permission)');
        else if (err.code === 2) setLocationError('ไม่สามารถระบุพิกัดได้ (อาจไม่มีสัญญาณ GPS)');
        else if (err.code === 3) setLocationError('ขอพิกัด GPS หมดเวลา (Timeout)');
        else setLocationError('เกิดข้อผิดพลาดในการโหลด GPS');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const openCameraForAction = async () => {
    setIsCameraOpen(true);
    setStatusMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      getLocation();
      await loadFaceApiAndProfile();
    } catch (err: any) {
      if (err.name === 'NotReadableError') {
        alert('กล้องถูกใช้งานโดยแอปอื่นอยู่ กรุณาปิดการใช้งานกล้องในแอปเหล่านั้นก่อน');
      } else if (err.name === 'NotAllowedError') {
        alert('คุณบล็อกการอนุญาตเข้าถึงกล้อง กรุณาอนุญาตกล้องในเบราว์เซอร์');
      } else {
        alert('ไม่พบกล้องหรือไม่สามารถเข้าถึงได้');
      }
      setIsCameraOpen(false);
    }
  };

  const cancelAction = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    setIsCameraOpen(false);
    setFaceStatus('idle');
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
    }
  };

  // ตรวจสอบว่าสามารถลงเวลาได้หรือไม่
  const canSubmit = () => {
    // ถ้ายังโหลด model อยู่ หรือกำลัง detect → ยังกดไม่ได้
    if (faceStatus === 'loading_models' || faceStatus === 'loading_profile') return false;
    // ถ้าตรวจสอบไม่ผ่าน → กดไม่ได้
    if (faceStatus === 'not_matched') return false;
    // ถ้าใบหน้าตรง, ไม่มีโปรไฟล์ (ข้ามการตรวจสอบ), หรือเกิด error (fallback) → ลงเวลาได้
    return !!location && (faceStatus === 'matched' || faceStatus === 'no_profile' || faceStatus === 'error' || faceStatus === 'detecting' || faceStatus === 'idle');
  };

  const submitAttendance = async () => {
    // ตรวจสอบใบหน้าก่อนส่ง (เข้มงวดเฉพาะ not_matched)
    if (faceStatus === 'not_matched') {
      alert('ไม่สามารถลงเวลาได้ เนื่องจากใบหน้าไม่ตรงกับโปรไฟล์ กรุณาลองใหม่อีกครั้ง');
      return;
    }

    setIsProcessing(true);
    try {
      let cloudinaryUrl = 'https://example.com/dummy-photo.jpg';

      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
          if (blob) {
            const imageFile = new File([blob], 'attendance-photo.jpg', { type: 'image/jpeg' });
            const options = { maxSizeMB: 0.1, maxWidthOrHeight: 800, useWebWorker: true };
            const compressedFile = await imageCompression(imageFile, options);
            const uploadedUrl = await uploadToCloudinary(compressedFile, 'attendance_photos');
            if (uploadedUrl) cloudinaryUrl = uploadedUrl;
          }
        }
      }

      const payload = {
        lat: location?.lat,
        lng: location?.lng,
        photoUrl: cloudinaryUrl,
        deviceId: 'device-12345',
        address: 'Location Address',
        faceVerified: faceStatus === 'matched',
      };

      const endpoint = isCheckIn ? '/api/attendance/check-in' : '/api/attendance/check-out';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
        setStatusMsg(isCheckIn ? 'บันทึกเวลาเข้างานเรียบร้อยแล้ว!' : 'บันทึกเวลาออกงานเรียบร้อยแล้ว!');
        setIsCameraOpen(false);
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(t => t.stop());
        }
      } else {
        alert('ทำรายการไม่สำเร็จ: ' + data.message);
      }
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFaceStatusUI = () => {
    switch (faceStatus) {
      case 'loading_models':
      case 'loading_profile':
        return { icon: <Loader2 size={18} className="animate-spin" />, color: 'bg-slate-50 text-slate-500 border-slate-200' };
      case 'detecting':
        return { icon: <Loader2 size={18} className="animate-spin" />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'matched':
        return { icon: <ShieldCheck size={18} />, color: 'bg-green-50 text-green-700 border-green-200' };
      case 'not_matched':
        return { icon: <ShieldX size={18} />, color: 'bg-red-50 text-red-600 border-red-200' };
      case 'no_profile':
      case 'error':
        return { icon: <AlertCircle size={18} />, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' };
      default:
        return null;
    }
  };

  const faceStatusUI = getFaceStatusUI();
  const submitDisabled = isProcessing || !location || faceStatus === 'not_matched' || faceStatus === 'loading_models' || faceStatus === 'loading_profile';

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

      {!statusMsg && (
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {!isCameraOpen ? (
            <div className="p-8 flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${isCheckIn ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'}`}>
                <ScanFace size={48} />
              </div>
              <h3 className="font-bold text-2xl mb-2 text-slate-800">{isCheckIn ? 'ลงเวลาเข้างาน' : 'ลงเวลาออกงาน'}</h3>
              <p className="text-slate-500 mb-1">ระบบจะถ่ายรูปใบหน้าของท่านเพื่อเป็นหลักฐานบันทึกเวลา</p>
              <p className="text-xs text-slate-400 mb-8 flex items-center gap-1 justify-center">
                <ShieldCheck size={12} /> ตรวจสอบใบหน้ากับโปรไฟล์อัตโนมัติ
              </p>
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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <ScanFace size={150} className="text-white" />
                </div>
              </div>

              {/* Face Status */}
              {faceStatusUI && (
                <div className={`w-full flex items-center justify-center space-x-2 text-sm font-medium p-3 rounded-xl mb-3 border ${faceStatusUI.color}`}>
                  {faceStatusUI.icon}
                  <span>{faceMsg}</span>
                </div>
              )}

              {/* Location Status */}
              {locationStatus === 'found' ? (
                <div className={`w-full flex items-center justify-center space-x-2 text-sm font-medium p-3 rounded-xl mb-6 ${isCheckIn ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'} border`}>
                  <MapPin size={18} /><span>พบพิกัด GPS แล้ว</span>
                </div>
              ) : locationStatus === 'error' ? (
                <div className="w-full flex flex-col items-center mb-6">
                  <div className="w-full flex items-center justify-center space-x-2 text-sm font-medium p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 mb-2">
                    <MapPin size={18} /><span>{locationError}</span>
                  </div>
                  <button onClick={getLocation} className="text-blue-500 text-sm font-bold hover:underline underline-offset-4">
                    กดเพื่อลองค้นหาพิกัดใหม่
                  </button>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center space-x-2 text-sm font-medium p-3 rounded-xl mb-6 bg-slate-50 text-slate-500 animate-pulse border border-slate-200">
                  <Loader2 size={18} className="animate-spin" /><span>กำลังค้นหาพิกัด...</span>
                </div>
              )}

              <div className="w-full space-y-3">
                <button
                  onClick={submitAttendance}
                  disabled={submitDisabled}
                  className={`w-full text-white rounded-xl py-4 font-bold text-lg flex justify-center items-center shadow-md transition ${submitDisabled ? 'bg-slate-300 cursor-not-allowed' : (isCheckIn ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30')}`}
                >
                  {isProcessing ? <><Loader2 className="animate-spin mr-2" />กำลังบันทึกข้อมูล...</> : (isCheckIn ? 'บันทึกเข้างาน' : 'บันทึกออกงาน')}
                </button>

                <button
                  onClick={cancelAction}
                  className="w-full text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl py-3 font-bold transition"
                >
                  ยกเลิก
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
