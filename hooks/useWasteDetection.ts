"use client";

import { useEffect, useRef, useState } from "react";
import { predictObject } from "@/lib/api";

export const useWasteDetection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [prediction, setPrediction] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [latency, setLatency] = useState<number>(0);

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

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const isProcessing = useRef(false);

  useEffect(() => {
    if (!isReady) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const captureAndAnalyze = async () => {
      if (isProcessing.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const TARGET_SIZE = 224;
      canvas.width = TARGET_SIZE;
      canvas.height = TARGET_SIZE;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const minDim = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - minDim) / 2;
      const startY = (video.videoHeight - minDim) / 2;

      ctx.drawImage(
        video, 
        startX, startY, minDim, minDim,
        0, 0, TARGET_SIZE, TARGET_SIZE
      );

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        isProcessing.current = true;
        setLoading(true);
        const startTime = performance.now();
        
        try {
          const result = await predictObject(blob);
          
          const CONFIDENCE_THRESHOLD = 0.6;
          
          if (result.confidence > CONFIDENCE_THRESHOLD) {
            setPrediction(result.label);
            setConfidence(result.confidence);
            setError(null);
          }
        } catch (err) {
        } finally {
          const endTime = performance.now();
          setLatency(Math.round(endTime - startTime));
          setLoading(false);
          isProcessing.current = false;
        }
      }, "image/jpeg", 0.7);
    };

    const intervalId = setInterval(captureAndAnalyze, 300);

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
