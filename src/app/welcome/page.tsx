"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Handshake, TrendingUp, Rocket, Share2, Globe, ArrowRight } from "lucide-react";
import { Navbar } from "./components/Navbar";

// --- CUSTOM INTERACTIVE PLANET PARTICLES CANVAS (HERO) ---
function PlanetParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    interface Particle {
      angle: number;
      orbitRadiusX: number;
      orbitRadiusY: number;
      speed: number;
      size: number;
      alpha: number;
      fadeSpeed: number;
      isFadingIn: boolean;
      life: number;
      maxLife: number;
      tilt: number;
      repelX: number;
      repelY: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 30;

    function createParticle(isInitial = false): Particle {
      const angle = Math.random() * Math.PI * 2;
      const orbitRadiusX = 210 + Math.random() * 180; // 160px to 310px
      const orbitRadiusY = orbitRadiusX * 0.45;
      const maxLife = 100 + Math.random() * 150;

      return {
        angle,
        orbitRadiusX,
        orbitRadiusY,
        speed: (0.003 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: 1.5 + Math.random() * 2.5,
        alpha: isInitial ? Math.random() * 0.7 : 0,
        fadeSpeed: 0.01 + Math.random() * 0.02,
        isFadingIn: !isInitial,
        life: isInitial ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
        tilt: -0.25,
        repelX: 0,
        repelY: 0,
      };
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const cxRef = () => width / 2 + 150;
    const cyRef = () => height / 2 - 120;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = cxRef();
      const cy = cyRef();
      const mouse = mouseRef.current;

      particles.forEach((p, idx) => {
        p.angle += p.speed;

        const baseX = Math.cos(p.angle) * p.orbitRadiusX;
        const baseY = Math.sin(p.angle) * p.orbitRadiusY;

        const cosTilt = Math.cos(p.tilt);
        const sinTilt = Math.sin(p.tilt);

        let targetX = cx + (baseX * cosTilt - baseY * sinTilt);
        let targetY = cy + (baseX * sinTilt + baseY * cosTilt);

        const dx = targetX + p.repelX - mouse.x;
        const dy = targetY + p.repelY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 90;

        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          const repelAngle = Math.atan2(dy, dx);
          const targetRepelX = Math.cos(repelAngle) * 35 * force;
          const targetRepelY = Math.sin(repelAngle) * 35 * force;
          
          p.repelX += (targetRepelX - p.repelX) * 0.15;
          p.repelY += (targetRepelY - p.repelY) * 0.15;
        } else {
          p.repelX *= 0.92;
          p.repelY *= 0.92;
        }

        const finalX = targetX + p.repelX;
        const finalY = targetY + p.repelY;

        p.life++;
        if (p.isFadingIn) {
          p.alpha += p.fadeSpeed;
          if (p.alpha >= 0.8) {
            p.alpha = 0.8;
            p.isFadingIn = false;
          }
        } else if (p.life > p.maxLife - 30) {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0) {
            p.alpha = 0;
          }
        }

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles[idx] = createParticle(false);
          return;
        }

        ctx.beginPath();
        ctx.arc(finalX, finalY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(188, 237, 9, ${p.alpha})`;
        
        if (p.size > 2.5) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#BCED09";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-20 pointer-events-none"
    />
  );
}

// --- INTERACTIVE CTA STAR CANVAS COMPONENT ---
interface Star {
  startX: number;
  startY: number;
  t: number;
  speed: number;
  size: number;
  waveAmp: number;
  waveFreq: number;
  color: string;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

function CtaCanvas({
  ctaRef,
  buttonRef,
}: {
  ctaRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isInsideRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cta = ctaRef.current;
    if (!canvas || !cta) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = cta.clientWidth;
    let height = cta.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = cta.clientWidth;
      height = cta.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cta.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => {
      isInsideRef.current = true;
    };

    const handleMouseLeave = () => {
      isInsideRef.current = false;
    };

    cta.addEventListener("mousemove", handleMouseMove);
    cta.addEventListener("mouseenter", handleMouseEnter);
    cta.addEventListener("mouseleave", handleMouseLeave);

    const stars: Star[] = [];
    const particles: TrailParticle[] = [];
    let lastEmitTime = 0;
    let nextEmitDelay = 1000 + Math.random() * 1300; // 1s to 2.3s random range

    let animationFrameId: number;

    const drawStarShape = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      c.beginPath();
      c.moveTo(x, y - size);
      c.quadraticCurveTo(x, y, x + size, y);
      c.quadraticCurveTo(x, y, x, y + size);
      c.quadraticCurveTo(x, y, x - size, y);
      c.quadraticCurveTo(x, y, x, y - size);
      c.closePath();
      c.fillStyle = color;
      c.fill();
    };

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      const rect = cta.getBoundingClientRect();
      const btn = buttonRef.current;
      let targetX = width * 0.25;
      let targetY = height * 0.75;
      if (btn) {
        const btnRect = btn.getBoundingClientRect();
        targetX = (btnRect.left - rect.left) + btnRect.width / 2;
        targetY = (btnRect.top - rect.top) + btnRect.height / 2;
      }

      // Check if time to emit new star from mouse
      if (isInsideRef.current) {
        if (!lastEmitTime) lastEmitTime = timestamp;
        if (timestamp - lastEmitTime > nextEmitDelay) {
          stars.push({
            startX: mouseRef.current.x,
            startY: mouseRef.current.y,
            t: 0,
            speed: 0.005 + Math.random() * 0.003,
            size: 6 + Math.random() * 5,
            waveAmp: 30 + Math.random() * 30,
            waveFreq: 1.5 + Math.random() * 1.5,
            color: Math.random() > 0.4 ? "#FFFFFF" : "#BCED09",
          });
          lastEmitTime = timestamp;
          nextEmitDelay = 1000 + Math.random() * 1300;
        }
      } else {
        lastEmitTime = timestamp;
      }

      // Update and draw stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.t += s.speed;

        if (s.t >= 1) {
          // Reached target button, burst!
          for (let k = 0; k < 12; k++) {
            particles.push({
              x: targetX,
              y: targetY,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              alpha: 1.0,
              size: 1.5 + Math.random() * 2.0,
              color: Math.random() > 0.3 ? "#010308" : "#FFFFFF",
            });
          }
          stars.splice(i, 1);
          continue;
        }

        const baseX = s.startX + (targetX - s.startX) * s.t;
        const baseY = s.startY + (targetY - s.startY) * s.t;

        const dx = targetX - s.startX;
        const dy = targetY - s.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let finalX = baseX;
        let finalY = baseY;

        if (dist > 10) {
          const nx = -dy / dist;
          const ny = dx / dist;
          const wave = Math.sin(s.t * Math.PI * 2 * s.waveFreq) * s.waveAmp;
          finalX = baseX + nx * wave;
          finalY = baseY + ny * wave;
        }

        ctx.shadowBlur = 12;
        ctx.shadowColor = s.color;
        drawStarShape(ctx, finalX, finalY, s.size, s.color);

        particles.push({
          x: finalX,
          y: finalY,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          alpha: 1.0,
          size: 1.5 + Math.random() * 2.0,
          color: s.color,
        });
      }

      ctx.shadowBlur = 0;

      // Update and draw trail particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.016;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === "#010308" ? `rgba(1, 3, 8, ${p.alpha})` : `rgba(255, 255, 255, ${p.alpha * 0.7})`;
        if (p.color === "#BCED09") {
          ctx.fillStyle = `rgba(188, 237, 9, ${p.alpha * 0.8})`;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cta.removeEventListener("mousemove", handleMouseMove);
      cta.removeEventListener("mouseenter", handleMouseEnter);
      cta.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [ctaRef, buttonRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}

// --- STANDALONE CALL TO ACTION SECTION COMPONENT ---
function CallToActionSection({ handleConnectWallet }: { handleConnectWallet: () => void }) {
  const ctaRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="py-28 md:py-40 bg-[#010308] max-w-7xl w-full mx-auto px-4 md:px-8">
      <div
        ref={ctaRef}
        className="relative w-full rounded-[48px] bg-[#BCED09] text-[#010308] p-12 md:p-24 overflow-hidden flex flex-col items-start justify-center min-h-[515px] shadow-[0_30px_60px_-15px_rgba(188,237,9,0.25)]"
        style={{ zIndex: 1 }}
      >
        {/* Background Ellipses (z-0) */}
        <div
          className="absolute w-[478px] h-[725px] -left-[207px] -top-[263px] rounded-full rotate-[15deg] pointer-events-none opacity-80"
          style={{
            zIndex: 0,
            background: "linear-gradient(153.12deg, rgba(188, 237, 9, 0.26) 15.48%, rgba(97, 113, 41, 0.26) 89.34%)"
          }}
        />
        <div
          className="absolute w-[986px] h-[604px] left-[65%] md:left-[734px] -top-[233px] rounded-full rotate-[33deg] pointer-events-none opacity-60"
          style={{
            zIndex: 0,
            background: "linear-gradient(153.12deg, rgba(188, 237, 9, 0.12) 15.48%, rgba(97, 113, 41, 0.12) 89.34%)"
          }}
        />
        <div
          className="absolute w-[676px] h-[489px] left-[10%] md:left-[157px] -top-[483px] rounded-full -rotate-[159deg] pointer-events-none opacity-70"
          style={{
            zIndex: 0,
            background: "linear-gradient(153.12deg, rgba(188, 237, 9, 0.32) 15.48%, rgba(97, 113, 41, 0.32) 89.34%)"
          }}
        />

        {/* Interactive Star-Emitter Canvas (z-10) */}
        <CtaCanvas ctaRef={ctaRef} buttonRef={buttonRef} />

        {/* Left Stacked Content and Button (all left-aligned, z-20 for visibility above stars) */}
        <div
          className="relative max-w-[580px] space-y-8 flex flex-col items-start text-left pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-[#010308]">
              Secure Your <br /> Financial Future
            </h2>
            <p className="text-[#343434] text-lg md:text-xl font-normal leading-relaxed max-w-xl">
              Join the elite circle of Stellar asset managers. Your path to premium DeFi starts with a single connection.
            </p>
          </div>

          <button
            ref={buttonRef}
            onClick={handleConnectWallet}
            className="px-10 py-5 bg-white text-[#010308] border border-transparent font-bold text-xl rounded-2xl shadow-[0_25px_50px_-12px_rgba(188,237,9,0.25)] hover:bg-[#1A1B1E] hover:text-[#BCED09] hover:border-black hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer pointer-events-auto"
            style={{ zIndex: 30 }}
          >
            Connect Wallet Now
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  );
}

// --- MAIN HOMEPAGE COMPONENT ---
export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Home");

  const handleConnectWallet = () => {
    console.log("Connect wallet triggered - placeholder function");
  };

  return (
    <div className="min-h-screen bg-[#010308] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#BCED09] selection:text-[#010308]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[920px] pt-12 md:pt-20 flex items-center justify-center bg-[radial-gradient(113.24%_213.1%_at_100%_0%,_rgba(188,237,9,0.15)_0%,_rgba(188,237,9,0)_40%),_radial-gradient(113.24%_213.1%_at_0%_100%,_rgba(188,237,9,0.05)_0%,_rgba(188,237,9,0)_40%)] border-b border-[#ffffff05]">
        
        {/* Background Image & Rectangular Left Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/hero.png"
            alt="Hero Background"
            fill
            priority
            className="object-cover opacity-85 object-center"
          />
          {/* Linear fade from solid black/dark on left to transparent on right to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#010308] via-[#010308]/90 to-transparent md:w-[65%]" />
        </div>

        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between relative z-10 gap-12 py-16">
          
          {/* Hero Left Content */}
          <div className="flex-1 flex flex-col items-start max-w-[580px] space-y-8 animate-[fadeInUp_0.8s_ease-out_forwards]">
            
            {/* Live Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#BCED09]/10 border border-[#BCED09]/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#BCED09] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#BCED09]">
                Stellar Network Live
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-[-1.5px]">
              The Future of <br />
              <span className="text-[#BCED09] drop-shadow-[0_0_20px_rgba(188,237,9,0.2)]">DeFi</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-gray-300 text-lg md:text-xl font-normal leading-relaxed max-w-[500px]">
              Sleek. Secure. Stellar. Experience the next generation of premium decentralized finance and luxury wealth management.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleConnectWallet}
              className="relative px-8 py-4 bg-[#BCED09] text-[#010308] font-bold text-lg rounded-xl shadow-[0_10px_15px_-3px_rgba(188,237,9,0.3),_0_4px_6px_-4px_rgba(188,237,9,0.3)] hover:bg-[#a6d107] hover:scale-[1.02] active:scale-95 hover:shadow-[0_15px_25px_-5px_rgba(188,237,9,0.4)] transition-all duration-300 cursor-pointer"
            >
              Connect Stellar Wallet
            </button>
          </div>

          {/* Hero Right Planet Interactive Canvas Column */}
          <div className="flex-1 w-full max-w-[550px] aspect-square relative flex items-center justify-center">
            
            {/* Interactive Particle Overlay */}
            <PlanetParticles />
            
            {/* Placeholder container matching cover dimensions just in case, but keep it transparent to let background show */}
            <div className="w-full h-full pointer-events-none absolute" />
          </div>

        </div>
      </section>

      {/* --- PREMIUM ECOSYSTEM (PROPERTIES) SECTION --- */}
      <section className="py-28 md:py-40 bg-[#010308] max-w-7xl w-full mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center space-y-6 mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Premium Ecosystem
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl font-light leading-relaxed">
            Designed for high-impact wealth management on the Stellar network with advanced intelligence tools.
          </p>
        </div>

        {/* 3 Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: P2P Marketplace */}
          <div className="group bg-[#18181b]/35 border border-[#ffffff05] rounded-3xl p-8 md:p-10 flex flex-col items-start gap-6 hover:scale-[1.04] hover:border-[#BCED09] hover:bg-[#18181b]/60 hover:shadow-[0_0_25px_rgba(188,237,9,0.1)] transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09] group-hover:bg-[#BCED09] group-hover:text-[#010308] group-hover:shadow-[0_0_15px_rgba(188,237,9,0.3)] transition-all duration-300">
              <Handshake className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white group-hover:text-[#BCED09] transition-colors duration-300">
                P2P Marketplace
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 text-[15px] font-light leading-relaxed transition-colors duration-300">
                Decentralized trading directly with others in a secure, non-custodial environment. Zero middleman, maximum efficiency.
              </p>
            </div>
          </div>

          {/* Card 2: Transaction Intelligence */}
          <div className="group bg-[#18181b]/35 border border-[#ffffff05] rounded-3xl p-8 md:p-10 flex flex-col items-start gap-6 hover:scale-[1.04] hover:border-[#BCED09] hover:bg-[#18181b]/60 hover:shadow-[0_0_25px_rgba(188,237,9,0.1)] transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09] group-hover:bg-[#BCED09] group-hover:text-[#010308] group-hover:shadow-[0_0_15px_rgba(188,237,9,0.3)] transition-all duration-300">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white group-hover:text-[#BCED09] transition-colors duration-300">
                Transaction Intelligence
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 text-[15px] font-light leading-relaxed transition-colors duration-300">
                Real-time tracking and professional financial analytics. Deep insights into your portfolio's performance and market trends.
              </p>
            </div>
          </div>

          {/* Card 3: Stellar Native */}
          <div className="group bg-[#18181b]/35 border border-[#ffffff05] rounded-3xl p-8 md:p-10 flex flex-col items-start gap-6 hover:scale-[1.04] hover:border-[#BCED09] hover:bg-[#18181b]/60 hover:shadow-[0_0_25px_rgba(188,237,9,0.1)] transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-[#BCED09]/10 border border-[#BCED09]/20 flex items-center justify-center text-[#BCED09] group-hover:bg-[#BCED09] group-hover:text-[#010308] group-hover:shadow-[0_0_15px_rgba(188,237,9,0.3)] transition-all duration-300">
              <Rocket className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white group-hover:text-[#BCED09] transition-colors duration-300">
                Stellar Native
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 text-[15px] font-light leading-relaxed transition-colors duration-300">
                Specialized money management built specifically for the Stellar network's speed and low transaction costs.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- STATS SECTION (SOLID LIME) --- */}
      <section className="w-full bg-[#BCED09] py-16 relative overflow-hidden">
        {/* Decorative lighter glowing circles for authentic ambient depth as shown in the image */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F4FFCA] filter blur-3xl opacity-55 pointer-events-none" />
        <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F4FFCA] filter blur-3xl opacity-45 pointer-events-none" />
        <div className="absolute left-[65%] top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F4FFCA] filter blur-3xl opacity-45 pointer-events-none" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F4FFCA] filter blur-3xl opacity-55 pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10 text-[#010308]">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-6xl md:text-7xl font-black tracking-tight">$1.2B+</span>
            <span className="text-xs font-black tracking-[2.5px] uppercase opacity-90">Total Volume Traded</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center justify-center space-y-2 border-y md:border-y-0 md:border-x border-[#010308]/10 py-8 md:py-0">
            <span className="text-6xl md:text-7xl font-black tracking-tight">450K+</span>
            <span className="text-xs font-black tracking-[2.5px] uppercase opacity-90">Active Wallets</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-6xl md:text-7xl font-black tracking-tight">A+</span>
            <span className="text-xs font-black tracking-[2.5px] uppercase opacity-90">Security Audit Rating</span>
          </div>

        </div>
      </section>

      {/* --- CTA SECTION (Extracted to Standalone Component) --- */}
      <CallToActionSection handleConnectWallet={handleConnectWallet} />

      {/* --- FOOTER SECTION --- */}
      <footer className="w-full bg-[#010308] border-t border-[#ffffff05] pt-24 pb-12">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Col 1: Brand Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/icono-ikash.svg"
                  alt="Logo de ikash"
                  width={42}
                  height={42}
                />
                <span className="text-2xl font-black tracking-tighter text-white">iKa$h</span>
              </div>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                The ultimate gateway for Stellar-based financial instruments and wealth optimization.
              </p>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-6">
              <h4 className="text-white text-base font-bold tracking-wider uppercase">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-400 hover:text-[#BCED09] text-sm transition-colors">Markets</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-[#BCED09] text-sm transition-colors">Trade</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-[#BCED09] text-sm transition-colors">Governance</Link></li>
              </ul>
            </div>

            {/* Col 3: Resources Links */}
            <div className="space-y-6">
              <h4 className="text-white text-base font-bold tracking-wider uppercase">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-400 hover:text-[#BCED09] text-sm transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-[#BCED09] text-sm transition-colors">Security Audit</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-[#BCED09] text-sm transition-colors">API Reference</Link></li>
              </ul>
            </div>

            {/* Col 4: Connect Links */}
            <div className="space-y-6">
              <h4 className="text-white text-base font-bold tracking-wider uppercase">Connect</h4>
              <div className="flex items-center gap-4">
                <Link href="#" className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center text-gray-300 hover:bg-[#BCED09] hover:text-[#010308] hover:shadow-[0_0_15px_rgba(188,237,9,0.3)] transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center text-gray-300 hover:bg-[#BCED09] hover:text-[#010308] hover:shadow-[0_0_15px_rgba(188,237,9,0.3)] transition-all duration-300">
                  <Globe className="w-5 h-5" />
                </Link>
                <Link href="#" className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center text-gray-300 hover:bg-[#BCED09] hover:text-[#010308] hover:shadow-[0_0_15px_rgba(188,237,9,0.3)] transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom copyright row */}
          <div className="border-t border-[#ffffff05] pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-bold tracking-widest">
            <span>© 2024 IKASH FINANCIAL. ALL RIGHTS RESERVED.</span>
            <div className="flex items-center gap-8">
              <Link href="#" className="hover:text-white transition-colors">PRIVACY</Link>
              <Link href="#" className="hover:text-white transition-colors">TERMS</Link>
              <Link href="#" className="hover:text-white transition-colors">COOKIES</Link>
            </div>
          </div>

        </div>
      </footer>

      {/* Tailwind keyframes animations support */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes waveMotion {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg) skewX(0deg);
          }
          50% {
            transform: translate(-38px, 12px) scale(1.07) rotate(2.5deg) skewX(-3deg);
          }
        }
      `}</style>
    </div>
  );
}
