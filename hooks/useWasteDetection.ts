"use client";

import { useEffect, useRef, useState } from "react";
import { predictObject, PredictionResponse } from "@/lib/api";

export const useWasteDetection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [prediction, setPrediction] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  // 1. Webcam Initialization
  useEffect(() => {
    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" 
          } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsReady(true);
          };
        }
      } catch (err) {
        console.error("Webcam access error:", err);
        setError("Camera Access Denied");
      }
    };

    initWebcam();

    // Cleanup
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // 2. The Inference Loop
  useEffect(() => {
    if (!isReady) return;

    // Create hidden canvas if it doesn't exist
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const captureAndAnalyze = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      // Draw current frame
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      // Convert to Blob and Predict
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        setLoading(true);
        try {
          const result = await predictObject(blob);
          
          // Latching Logic: Only update if we are reasonably sure
          const CONFIDENCE_THRESHOLD = 0.6; // 60%
          
          if (result.confidence > CONFIDENCE_THRESHOLD) {
            setPrediction(result.label);
            setConfidence(result.confidence);
            setError(null);
          }
          // If < threshold, we do nothing (keep previous result)
        } catch (err) {
            // Graceful error handling (silently fail implies we just keep trying)
           console.error("Prediction failed:", err);
           // We might not want to show an error on UI for every single failed frame if backend blips.
           // calling it 'ANALYZING...' or similar could be handled by component logic, 
           // but here we can just leave values as is or reset if critical.
        } finally {
          setLoading(false);
        }
      }, "image/jpeg", 0.7); // 0.7 quality to reduce payload size
    };

    const intervalId = setInterval(captureAndAnalyze, 300); // 300ms for "Fastness"

    return () => clearInterval(intervalId);
  }, [isReady]);

  return {
    videoRef,
    canvasRef,
    prediction,
    confidence,
    loading,
    error,
    isReady
  };
};
