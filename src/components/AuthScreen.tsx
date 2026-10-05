import React from "react";
import { GlassAuthCard } from "./auth/GlassAuthCard";
import GradientWaves from "./GradientWaves";

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-sidebar select-none">
      {/* Dynamic Animated Gradient Waves Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GradientWaves
          horizonColor="#052e16"
          waveColor="#10b981"
          crestColor="#34d399"
          speed={0.35}
          amplitude={2.0}
          waveScale={0.7}
          waveRatio={0.9}
          swell={30}
          turbulence={18}
          tilt={1.15}
          zoom={1.0}
          height={5.0}
          fogDepth={16}
          brightness={0.85}
          opacity={0.8}
          mouseInteraction={true}
          grain={true}
          grainIntensity={0.04}
          className="w-full h-full"
        />
      </div>

      {/* Dark Ambient Overlay Vignette */}
      <div className="absolute inset-0 z-[1] bg-black/40 backdrop-blur-[1px] pointer-events-none" />

      {/* Centered Glassmorphic Card */}
      <div className="relative z-10 w-full flex items-center justify-center animate-in fade-in-50 zoom-in-95 duration-300">
        <GlassAuthCard onSuccess={onAuthSuccess} />
      </div>
    </div>
  );
};

export default AuthScreen;
