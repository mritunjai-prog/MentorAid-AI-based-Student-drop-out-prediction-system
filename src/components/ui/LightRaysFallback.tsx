import "./LightRaysFallback.css";

interface LightRaysFallbackProps {
  raysOrigin?: string;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  className?: string;
}

// Fallback component that uses pure CSS instead of WebGL
export function LightRaysFallback({ className = "" }: LightRaysFallbackProps) {
  return (
    <div className={`light-rays-fallback ${className}`.trim()}>
      <div className="rays-gradient"></div>
    </div>
  );
}
