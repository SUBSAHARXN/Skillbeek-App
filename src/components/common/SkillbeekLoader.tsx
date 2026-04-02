import React, { useEffect, useRef } from "react";

/* ── "Original Thinking" Rose Curve ────────────────────────────── */
const CURVE = {
  particleCount: 36,
  trailSpan: 0.41,
  durationMs: 4600,
  rotationDurationMs: 9000,
  pulseDurationMs: 2100,
  strokeWidth: 2.5,
};

/* ── Colour tokens (from Figma variables) ──────────────────────── */
const COLORS = {
  ghost: { r: 0x2f, g: 0x2c, b: 0x32, a: 0.26 },       // overlay-bg #2F2C32 @ 26 %
  orbLight: { r: 0x2f, g: 0x2c, b: 0x32 },               // primary-grayscale-800  #2F2C32
  orbDark:  { r: 0xfa, g: 0xf8, b: 0xfc },               // primary-grayscale-50   #FAF8FC
};

/* ── Helper: evaluate rose-curve point ─────────────────────────── */
function rosePoint(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2;
  const x = 7 * Math.cos(t) - 3 * detailScale * Math.cos(7 * t);
  const y = 7 * Math.sin(t) - 3 * detailScale * Math.sin(7 * t);
  return { x: 50 + x * 3.9, y: 50 + y * 3.9 };
}

/* ── Component ─────────────────────────────────────────────────── */
interface SkillbeekLoaderProps {
  size?: number;
  darkMode?: boolean;
}

export default function SkillbeekLoader({
  size = 120,
  darkMode = false,
}: SkillbeekLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset on each mount (React strict-mode safe)
    runningRef.current = true;
    startRef.current = null;

    const SCALE = size / 100; // curve space is 0-100
    const {
      particleCount,
      trailSpan,
      durationMs,
      rotationDurationMs,
      pulseDurationMs,
      strokeWidth,
    } = CURVE;

    const orb = darkMode ? COLORS.orbDark : COLORS.orbLight;
    const ghost = COLORS.ghost;

    /* Pre-compute a dense ghost outline (200 segments) */
    function buildGhostPath(detailScale: number): Path2D {
      const segments = 200;
      const p = new Path2D();
      for (let i = 0; i <= segments; i++) {
        const pt = rosePoint(i / segments, detailScale);
        if (i === 0) p.moveTo(pt.x * SCALE, pt.y * SCALE);
        else p.lineTo(pt.x * SCALE, pt.y * SCALE);
      }
      p.closePath();
      return p;
    }

    /* ── Render loop ────────────────────────────────────────────── */
    function frame(ts: number) {
      if (!runningRef.current) return;
      if (!startRef.current) startRef.current = ts;

      const elapsed = ts - startRef.current;
      const progress = (elapsed % durationMs) / durationMs;
      const rotation = ((elapsed % rotationDurationMs) / rotationDurationMs) * Math.PI * 2;

      // Smooth pulsing detail scale (0.85 → 1.0 → 0.85)
      const pulseT = (elapsed % pulseDurationMs) / pulseDurationMs;
      const detailScale = 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(pulseT * Math.PI * 2));

      ctx!.clearRect(0, 0, size, size);

      // Apply whole-canvas rotation
      ctx!.save();
      ctx!.translate(size / 2, size / 2);
      ctx!.rotate(rotation);
      ctx!.translate(-size / 2, -size / 2);

      // ─── Ghost outline ─────────────────────────────────────────
      const ghostPath = buildGhostPath(detailScale);
      ctx!.strokeStyle = `rgba(${ghost.r},${ghost.g},${ghost.b},${ghost.a})`;
      ctx!.lineWidth = strokeWidth * SCALE;
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      ctx!.stroke(ghostPath);

      // ─── Particle trail ────────────────────────────────────────
      for (let i = particleCount - 1; i >= 0; i--) {
        const t = (progress - (i / particleCount) * trailSpan + 2) % 1;
        const pt = rosePoint(t, detailScale);
        const frac = 1 - i / particleCount; // 1 at lead, 0 at tail

        const radius = Math.max(0.5, 4 * frac * SCALE);
        const alpha = frac * 0.9;

        ctx!.beginPath();
        ctx!.arc(pt.x * SCALE, pt.y * SCALE, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${orb.r},${orb.g},${orb.b},${alpha})`;
        ctx!.fill();
      }

      // ─── Lead particle (bright head) ───────────────────────────
      const leadPt = rosePoint(progress, detailScale);
      const leadRadius = 5 * SCALE;
      ctx!.beginPath();
      ctx!.arc(leadPt.x * SCALE, leadPt.y * SCALE, leadRadius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${orb.r},${orb.g},${orb.b},1)`;
      ctx!.fill();

      // Soft glow around lead
      const glow = ctx!.createRadialGradient(
        leadPt.x * SCALE, leadPt.y * SCALE, 0,
        leadPt.x * SCALE, leadPt.y * SCALE, leadRadius * 3,
      );
      glow.addColorStop(0, `rgba(${orb.r},${orb.g},${orb.b},0.35)`);
      glow.addColorStop(1, `rgba(${orb.r},${orb.g},${orb.b},0)`);
      ctx!.beginPath();
      ctx!.arc(leadPt.x * SCALE, leadPt.y * SCALE, leadRadius * 3, 0, Math.PI * 2);
      ctx!.fillStyle = glow;
      ctx!.fill();

      ctx!.restore();

      animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);

    return () => {
      runningRef.current = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [size, darkMode]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ display: "block" }}
      />
    </div>
  );
}
