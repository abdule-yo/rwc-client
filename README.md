# Real-Time Object Detection Showcase

A stunning cinematic cyberpunk web application featuring real-time object detection with an immersive HUD interface.

![Real-Time Detection System](https://img.shields.io/badge/Status-Active-00d4ff?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)

## 🎯 Features

- **Real-Time Webcam Processing**: Captures and analyzes video frames at 2 Hz
- **Cinematic HUD Interface**: Iron Man-inspired heads-up display with scanning effects
- **Smooth Animations**: Framer Motion powered scanning line, glitch effects, and transitions
- **Performance Optimized**: Throttled API calls, 60fps video, minimal re-renders
- **Graceful Error Handling**: "Signal Lost" state for permission denials
- **Mock API Ready**: Easy integration with your object detection backend

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) and grant camera permissions.

## 🎨 Visual Design

- **Cyberpunk Aesthetic**: Deep dark slate background with electric cyan accents
- **Technical Typography**: Geist Mono for that engineering feel
- **Scanning Grid**: Animated grid overlay with pulsing effect
- **Corner Brackets**: SVG viewfinder elements
- **Vertical Scanning Line**: Continuous 3-second animation loop

## 🏗️ Architecture

```
app/
├── page.tsx                 # Main orchestrator
├── layout.tsx               # Root layout
└── globals.css              # Tailwind + animations

components/Scanner/
├── CameraFeed.tsx           # Video element
├── HudOverlay.tsx           # HUD visual effects
└── ResultDisplay.tsx        # Result presentation

hooks/
├── useWebcam.ts             # Webcam access
└── useThrottledDetection.ts # Frame capture + API

lib/
└── api.ts                   # Axios client + mock API
```

## 🔧 Configuration

### Connect Your API

Update `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";
```

Expected API format:
- **Endpoint**: `POST /predict`
- **Request**: FormData with image blob
- **Response**: `{ label: string, confidence: number }`

### Adjust Scan Rate

Modify `intervalMs` in `app/page.tsx`:

```typescript
const { result, isAnalyzing, error } = useThrottledDetection({
  videoRef,
  isReady,
  intervalMs: 500, // milliseconds between scans
});
```

### Customize Colors

Edit CSS variables in `app/globals.css`:

```css
:root {
  --accent-cyan: #06b6d4;
  --accent-cyan-glow: #22d3ee;
}
```

## 📦 Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 12
- **HTTP Client**: Axios 1.13
- **Icons**: Lucide React
- **Language**: TypeScript 5.9

## 🎬 Performance

- **Video Frame Rate**: 60 FPS
- **API Call Rate**: 2 Hz (500ms intervals)
- **Optimization**: useRef for video, canvas-based frame capture
- **Bundle Size**: Optimized with Next.js Turbopack

## 📝 License

MIT

## 🙏 Acknowledgments

Design inspired by:
- Iron Man's HUD interface
- Apple's minimalist design philosophy
- Cyberpunk aesthetic principles
