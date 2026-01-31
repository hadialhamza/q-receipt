"use client";

import { useState } from "react";

export function GlassMagnifier({
  imageSrc,
  magnifierSize = 200,
  zoomLevel = 2.5,
}) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const handleMouseMove = (e) => {
    const elem = e.currentTarget;
    const { left, top, width, height } = elem.getBoundingClientRect();

    // Calculate mouse position relative to image
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Store image dimensions for background positioning
    if (imgDimensions.width === 0) {
      setImgDimensions({ width, height });
    }

    setMagnifierPos({ x, y });
    setShowMagnifier(true);
  };

  return (
    <div
      className="relative overflow-hidden cursor-none w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
    >
      {/* Main Image */}
      <img
        src={imageSrc}
        alt="Receipt Preview"
        className="w-full h-auto object-contain pointer-events-none select-none"
        draggable={false}
      />

      {/* Magnifying Glass */}
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            left: `${magnifierPos.x - magnifierSize / 2}px`,
            top: `${magnifierPos.y - magnifierSize / 2}px`,
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            border: "4px solid rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            backgroundColor: "white",
            backgroundImage: `url('${imageSrc}')`,
            backgroundRepeat: "no-repeat",
            // Critical fix: Calculate background position to center the zoomed area
            backgroundSize: `${imgDimensions.width * zoomLevel}px ${imgDimensions.height * zoomLevel}px`,
            backgroundPosition: `${-magnifierPos.x * zoomLevel + magnifierSize / 2}px ${-magnifierPos.y * zoomLevel + magnifierSize / 2}px`,
            pointerEvents: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.3)",
            zIndex: 50,
            transition: "border-color 0.1s ease",
          }}
        />
      )}
    </div>
  );
}
