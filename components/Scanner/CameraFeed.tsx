"use client";

import React from "react";

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ videoRef }) => {
  return (
    <div className="relative w-full h-[90vh] overflow-hidden bg-slate-950">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};
