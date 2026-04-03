"use client";

import SpeedTest from "@/components/SpeedTest";
import { motion } from "framer-motion";

export default function SpeedTestPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pt-32 pb-24 px-4 overflow-x-hidden">
      <div className="container mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-[#4a3b4e] mb-4 tracking-tight"
          >
            รายละเอียดของบริการ
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.2 }}
            className="h-1.5 w-24 bg-[#83697b] mx-auto rounded-full"
          />
        </div>

        {/* Speed Test Body */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SpeedTest />
        </motion.div>

        {/* Decorative elements */}
        <div className="mt-20 text-center text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
          Professional Network Analysis • KTLTC
        </div>
      </div>
    </main>
  );
}
