import axios from "axios";

// Real API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, 
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export interface PredictionResponse {
  label: string;
  confidence: number;
  id: number;
}

export const predictObject = async (
  imageBlob: Blob
): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append("file", imageBlob, "frame.jpg");

  try {
    const response = await apiClient.post("/predict", formData);
    return {
      label: response.data.label,
      confidence: response.data.confidence,
      id: response.data.id,
    };
  } catch (error) {
    throw error;
  }
};
