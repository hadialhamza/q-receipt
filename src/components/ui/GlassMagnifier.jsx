"use client";

import { useState } from "react";

export function GlassMagnifier({
  imageSrc,
  magnifierSize = 200, // গ্লাসের সাইজ (কত বড় গোল হবে)
  zoomLevel = 2.5, // জুম লেভেল (কত গুণ বড় দেখাবে)
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    // মাউসের পজিশন ক্যালকুলেশন (রিলেটিভ টু ইমেজ)
    const x = e.clientX - left;
    const y = e.clientY - top;

    setCursorPosition({ x, y });

    // জুম করার জন্য ব্যাকগ্রাউন্ড পজিশন ক্যালকুলেশন
    const xPerc = (x / width) * 100;
    const yPerc = (y / height) * 100;

    setPosition({ x: xPerc, y: yPerc });
    setShowMagnifier(true);
  };

  return (
    <div
      className="relative overflow-hidden cursor-none w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowMagnifier(false)}
    >
      {/* মেইন ইমেজ */}
      <img
        src={imageSrc}
        alt="Preview"
        className="w-full h-auto object-contain pointer-events-none"
      />

      {/* ম্যাগনিফাইং গ্লাস (শুধু হোভার করলেই আসবে) */}
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            left: `${cursorPosition.x - magnifierSize / 2}px`,
            top: `${cursorPosition.y - magnifierSize / 2}px`,
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            border: "4px solid rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            backgroundColor: "white",
            backgroundImage: `url('${imageSrc}')`,
            backgroundRepeat: "no-repeat",
            // ম্যাজিক এখানে: ইমেজের সাইজ বাড়িয়ে পজিশন ঠিক করা হচ্ছে
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            pointerEvents: "none", // যাতে মাউস ইভেন্ট ব্লক না করে
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)", // সুন্দর শ্যাডো
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
}
