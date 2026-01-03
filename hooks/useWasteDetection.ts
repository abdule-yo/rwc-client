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
  const [latency, setLatency] = useState<number>(0);

  // Webcam Initialization

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

  // Inference Loop

  const isProcessing = useRef(false);

  useEffect(() => {
    if (!isReady) return;

    // Create hidden canvas if it doesn't exist
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const captureAndAnalyze = async () => {
      if (isProcessing.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      // Draw current frame (Center Crop + Resize to 224x224)
      const TARGET_SIZE = 224;
      canvas.width = TARGET_SIZE;
      canvas.height = TARGET_SIZE;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Calculate Center Crop
      const minDim = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - minDim) / 2;
      const startY = (video.videoHeight - minDim) / 2;

      ctx.drawImage(
        video, 
        startX, startY, minDim, minDim, // Source (Crop)
        0, 0, TARGET_SIZE, TARGET_SIZE  // Destination (Resize)
      );

      // Convert to Blob and Predict
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        isProcessing.current = true;
        setLoading(true);
        const startTime = performance.now();
        
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
            // Silently fail to keep the experience smooth
        } finally {
          const endTime = performance.now();
          setLatency(Math.round(endTime - startTime));
          setLoading(false);
          isProcessing.current = false;
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
    isReady,
    latency
  };
};
