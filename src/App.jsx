import React, { useRef, useEffect, useState } from 'react';
import './index.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import minime from './assets/images/minime.png';
import me from './assets/images/me.png';
import bigme from './assets/images/bigme.png';
import medance from './assets/videos/Medance.mp4';

gsap.registerPlugin(useGSAP, Draggable, ScrollTrigger);

// --- STATIC DATA: Moved outside to optimize memory & render cycles ---
const WORD = "PORTFOLIO".split('');

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const TECH_STACK = [
  'React / Next.js',
  'React Native',
  'Node.js / Express',
  'Python / Django',
  'MongoDB / PostgreSQL',
  'AI / ML / RAG',
];

const INFO_DATA = [
  { label: 'Location', value: 'Kozhikode, Kerala, India' },
  { label: 'Email', value: 'ayushbiju8@gmail.com' },
  { label: 'Phone', value: '+91 8590679146' },
  { label: 'Freelance', value: 'Available' },
  { label: 'Languages', value: 'Python, Java, JS, C++' },
];

const PROJECTS_DATA = [
  {
    title: "Xelerate Event Web App",
    year: "2024",
    desc: "Built a full-stack event registration and management web app using React & Node.js. Used during the IEDC Xelerate event.",
    tags: ["React", "Node.js", "Full-Stack"]
  },
  {
    title: "AI Fraud & Scam Detection",
    year: "2024",
    desc: "Built a RAG-based AI prototype that detects scam messages and auto-generates complaint reports. Built in a 36-hour hackathon.",
    tags: ["RAG", "AI", "Hackathon"]
  },
  {
    title: "Mulamootil Supermarket",
    year: "2025",
    desc: "Built a responsive React-based website with product listings and customer enquiry features. Delivered for production use.",
    tags: ["React", "Web Development"]
  }
];

function App() {
  const container = useRef();
  const landingRef = useRef();
  const experienceNoticeRef = useRef();
  const footerRef = useRef();
  const appRef = useRef();
  const isAnimating = useRef(true);

  const [leftPeeled, setLeftPeeled] = React.useState(false);
  const [rightPeeled, setRightPeeled] = React.useState(false);
  const [isFanOn, setIsFanOn] = React.useState(true);
  const [currentYear] = useState(new Date().getFullYear());
  const [submitResult, setSubmitResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useGSAP(() => {
    // 0. ENHANCED SMOOTH SCROLL (Lenis) - Optimized for 60/120Hz
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // 1. DEPTH EFFECT: Scale & Blur landing section
    gsap.to(landingRef.current, {
      scale: 0.9,
      opacity: 0.5,
      filter: 'blur(8px)',
      force3D: true,
      scrollTrigger: {
        trigger: landingRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // 2. LANDING ENTRANCE: Letters & Interactivity
    const targets = gsap.utils.toArray('.letter-target');
    const hitboxes = gsap.utils.toArray('.hitbox');

    WORD.forEach((_, i) => {
      const pair = [targets[i], targets[i + WORD.length]];
      gsap.fromTo(pair,
        { y: 150, opacity: 0, rotationX: -90 },
        {
          y: 0, opacity: 1, rotationX: 0,
          duration: 1.2, delay: i * 0.08,
          ease: 'back.out(1.7)', force3D: true, clearProps: "transform",
          onComplete: () => {
            if (i === WORD.length - 1) {
              isAnimating.current = false;
              Draggable.create(hitboxes, {
                type: "x,y",
                onDrag: function () {
                  const idx = hitboxes.indexOf(this.target);
                  const dragPair = [targets[idx], targets[idx + WORD.length]];
                  gsap.to(dragPair, { x: this.x, y: this.y, duration: 0.2, ease: "power2.out", overwrite: 'auto' });
                },
                onDragEnd: function () {
                  const idx = hitboxes.indexOf(this.target);
                  const dragPair = [targets[idx], targets[idx + WORD.length]];
                  gsap.to(dragPair, { x: this.x, y: this.y, duration: 0.6, ease: "back.out(2.5)", overwrite: 'auto' });
                }
              });
            }
          }
        }
      );
    });

    // Subtitle entrance
    gsap.fromTo('.badge-text', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, delay: 1.2, ease: 'power2.out', force3D: true, stagger: 0.1 });

    // Stickers
    Draggable.create('.minime-wrapper', { type: "x,y", bounds: container.current, force3D: true });

  }, { scope: container });

  useGSAP(() => {
    // 3. CONSOLIDATED SCROLL REVEALS - HIGH PERFORMANCE BATCH
    // We group all standard reveals into a single initialization loop to reduce overhead

    // a) Content Reveals (Titles, Lines)
    gsap.utils.toArray('.reveal-line').forEach(target => {
      gsap.from(target, {
        scrollTrigger: { trigger: target, start: "top 92%", toggleActions: "play none none none" },
        y: "135%", duration: 1, ease: "power3.out", force3D: true
      });
    });

    // b) Card & List Reveals (Projects, Info, Contact)
    const cardSelectors = ['.project-card', '.contact-form-field'];
    cardSelectors.forEach(selector => {
      gsap.utils.toArray(selector).forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "play none none none" },
          opacity: 0, y: 40, duration: 0.8, delay: i % 3 * 0.1, ease: "power2.out", force3D: true
        });
      });
    });

    // c) Specialized Contact Animations
    gsap.from('.contact-header-border', {
      scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none none' },
      scaleX: 0, transformOrigin: 'left', duration: 2, ease: 'expo.out'
    });

    gsap.from('.contact-subtitle', {
      scrollTrigger: { trigger: '#contact', start: 'top 75%', toggleActions: 'play none none none' },
      opacity: 0, x: -40, duration: 1.2, stagger: 0.2, ease: 'power3.out'
    });

    gsap.from('.contact-info-item', {
      scrollTrigger: { trigger: '#contact', start: 'top 70%', toggleActions: 'play none none none' },
      x: -50, opacity: 0, rotationY: -15, duration: 1, stagger: 0.15, ease: 'back.out(1.2)'
    });

    gsap.from('.contact-form-card', {
      scrollTrigger: { trigger: '.contact-form-card', start: 'top 85%', toggleActions: 'play none none none' },
      y: 100, opacity: 0, scale: 0.98, duration: 1.5, ease: 'expo.out', force3D: true
    });

    gsap.from('.contact-corner-accent', {
      scrollTrigger: { trigger: '.contact-form-card', start: 'top 80%', toggleActions: 'play none none none' },
      scale: 0, opacity: 0, duration: 1, stagger: 0.15, ease: 'elastic.out(1, 0.75)'
    });

    // d) Footer Specialized Animations
    gsap.from('.footer-divider', {
      scrollTrigger: { trigger: '#footer', start: 'top bottom', toggleActions: 'play none none none' },
      scaleX: 0, transformOrigin: 'center', duration: 2.5, ease: 'expo.inOut'
    });

    gsap.from('.footer-corner', {
      scrollTrigger: { trigger: '#footer', start: 'top bottom', toggleActions: 'play none none none' },
      scale: 0, opacity: 0, duration: 1.5, stagger: 0.1, ease: 'expo.out'
    });

    gsap.from('.footer-bottom-bar', {
      scrollTrigger: { trigger: '#footer', start: 'top bottom', toggleActions: 'play none none none' },
      y: 40, opacity: 0, duration: 1.5, ease: 'expo.out'
    });

    // e) Ambient Pulsing
    gsap.to(['.contact-glow-1', '.footer-glow-1'], { x: 80, y: -40, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(['.contact-glow-2', '.footer-glow-2'], { x: -60, y: 30, duration: 15, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // f) Seamless Marquee Animation
    if (document.querySelector('.footer-marquee-inner')) {
      gsap.to('.footer-marquee-inner', {
        xPercent: -50,
        duration: 80,
        repeat: -1,
        ease: 'none',
        force3D: true,
        overwrite: 'auto'
      });
    }

  });

  // 3D Floating/Fluttering + Interactive Physics for Experience Notice
  // Using useEffect instead of useGSAP so it correctly re-runs on every state change
  useEffect(() => {
    if (!experienceNoticeRef.current) return;

    // Kill ALL existing animations on this element before applying new ones
    gsap.killTweensOf(experienceNoticeRef.current);

    // --- CASE 1: BOTH TAPES REMOVED (FREE FALL) ---
    if (leftPeeled && rightPeeled) {
      gsap.to(experienceNoticeRef.current, {
        y: 2500,
        rotationZ: 120,
        rotationX: 180,
        opacity: 0,
        duration: 3,
        ease: "power4.in",
        force3D: true,
        boxShadow: "0 0px 0px rgba(0,0,0,0)",
        onComplete: () => {
          if (experienceNoticeRef.current) {
            experienceNoticeRef.current.style.display = 'none';
          }
        }
      });
      return;
    }

    // --- CASE 2: ONE TAPE REMOVED (HINGE SWING) ---
    if (leftPeeled || rightPeeled) {
      const remainingSide = leftPeeled ? "right" : "left";
      gsap.set(experienceNoticeRef.current, { transformOrigin: `top ${remainingSide}` });

      // Swing down
      gsap.to(experienceNoticeRef.current, {
        rotationZ: leftPeeled ? -80 : 80,
        rotationX: 10,
        y: 40,
        boxShadow: "0 60px 100px -20px rgba(0,0,0,0.9)",
        duration: 2.5,
        ease: "power3.out",
        force3D: true,
      });

      // Sway only if fan is on
      if (isFanOn) {
        gsap.to(experienceNoticeRef.current, {
          rotationZ: leftPeeled ? "-=4" : "+=4",
          duration: 4,
          delay: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true
        });
      }
      return;
    }

    // --- CASE 0: BOTH TAPES INTACT ---
    gsap.set(experienceNoticeRef.current, { transformOrigin: "top center" });

    if (isFanOn) {
      // 3D Flutter
      gsap.to(experienceNoticeRef.current, {
        rotationX: 12,
        rotationY: 2,
        z: 40,
        force3D: true,
        boxShadow: "0 25px 30px -10px rgba(0,0,0,0.6), 0 80px 140px -25px rgba(0,0,0,0.7)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });

      gsap.to(experienceNoticeRef.current, {
        x: '+=4',
        y: '+=8',
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    } else {
      // Fan OFF: Settle to static
      gsap.to(experienceNoticeRef.current, {
        rotationX: 0,
        rotationY: 0,
        rotationZ: -0.5,
        z: 0,
        x: 0,
        y: 0,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        duration: 1.5,
        ease: "power2.inOut",
        force3D: true
      });
    }

    return () => {
      if (experienceNoticeRef.current) {
        gsap.killTweensOf(experienceNoticeRef.current);
      }
    };
  }, [leftPeeled, rightPeeled, isFanOn]);

  // Reset handler: bring paper back to original state
  const handleReset = () => {
    if (!experienceNoticeRef.current) return;

    // Restore visibility
    experienceNoticeRef.current.style.display = '';

    // Reset tape states
    setLeftPeeled(false);
    setRightPeeled(false);
    setIsFanOn(true);

    // Animate the paper dropping back into place from above
    gsap.killTweensOf(experienceNoticeRef.current);
    gsap.set(experienceNoticeRef.current, {
      transformOrigin: "top center",
      rotationZ: 0,
      rotationX: 0,
      rotationY: 0,
      x: 0,
      z: 0,
    });
    gsap.fromTo(experienceNoticeRef.current,
      {
        y: -300,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "bounce.out",
        force3D: true,
        boxShadow: "0 25px 30px -10px rgba(0,0,0,0.6), 0 80px 140px -25px rgba(0,0,0,0.7)",
      }
    );
  };

  const handleMouseMove = (e, index) => {
    if (isAnimating.current) return;

    const dragInstance = Draggable.get(e.currentTarget);
    if (dragInstance && dragInstance.isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxPull = 50;
    let pullX = (e.clientX - centerX) * 0.3;
    let pullY = (e.clientY - centerY) * 0.3;

    if (Math.abs(pullX) > maxPull) pullX = Math.sign(pullX) * maxPull;
    if (Math.abs(pullY) > maxPull) pullY = Math.sign(pullY) * maxPull;

    const homeX = dragInstance ? dragInstance.x : 0;
    const homeY = dragInstance ? dragInstance.y : 0;

    const targets = gsap.utils.toArray('.letter-target');
    const pair = [targets[index], targets[index + WORD.length]];

    gsap.to(pair, {
      x: homeX + pullX,
      y: homeY + pullY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = (index) => {
    if (isAnimating.current) return;

    const hitboxes = gsap.utils.toArray('.hitbox');
    const dragInstance = Draggable.get(hitboxes[index]);

    if (dragInstance && dragInstance.isDragging) return;

    const homeX = dragInstance ? dragInstance.x : 0;
    const homeY = dragInstance ? dragInstance.y : 0;

    const targets = gsap.utils.toArray('.letter-target');
    const pair = [targets[index], targets[index + WORD.length]];

    gsap.to(pair, {
      x: homeX,
      y: homeY,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto'
    });
  };

  const textStyle = {
    fontSize: 'clamp(8rem, 24vw, 50rem)',
    lineHeight: 0.78,
    perspective: '1000px',
  };
  const h1Classes = "font-droid font-normal uppercase m-0 p-0 flex flex-row items-center justify-center tracking-wide";

  return (
    <div className="w-full" ref={appRef}>

      {/* ======================== LANDING SECTION ======================== */}
      <section
        id="home"
        ref={landingRef}
        className="sticky top-0 z-[1] flex items-center justify-center h-screen w-full bg-[#111111] overflow-hidden relative will-change-transform"
      >

        <div ref={container} className="w-full h-full relative z-10 flex items-center justify-center">

          {/* BACKGROUND LAYER: WHITE TEXT */}
          <div className="absolute inset-0 flex items-center justify-center w-full h-full z-0 pointer-events-none">
            <h1 className={`${h1Classes} text-white`} style={textStyle}>
              {WORD.map((char, i) => (
                <span key={`white-${i}`} className="letter-target gpu-layer relative inline-block origin-bottom opacity-1 will-change-transform">
                  {char}
                </span>
              ))}
            </h1>
          </div>

          {/* FOREGROUND LAYER: TORN PAPER + RED TEXT */}
          <div
            className="absolute inset-0 flex items-center justify-center w-full h-full z-10 pointer-events-none"
            style={{ filter: 'drop-shadow(-8px 10px 15px rgba(0,0,0,0.65))' }}
          >
            <div
              className="absolute inset-0 w-full h-full"
              style={{ clipPath: 'polygon(57% 69%, 52% 61%, 48% 63%, 43% 55%, 48% 48%, 53% 47%, 60% 38%, 64% 36%, 68% 31%, 71% 37%, 77% 40%, 82% 45%, 75% 54%, 70% 55%, 64% 64%, 60% 63%)' }}
            >
              <div className="absolute inset-0 w-full h-full bg-[#EAE8E3]"></div>
              <div className="absolute inset-0 flex items-center justify-center w-full h-full z-20">
                <h1 className={`${h1Classes} text-[#8B0000]`} style={textStyle}>
                  {WORD.map((char, i) => (
                    <span key={`red-${i}`} className="letter-target gpu-layer relative inline-block origin-bottom opacity-1 will-change-transform">
                      {char}
                    </span>
                  ))}
                </h1>
              </div>
            </div>
          </div>

          {/* INTERACTIVE HITBOX LAYER */}
          <div className="absolute inset-0 flex items-center justify-center w-full h-full z-30 pointer-events-auto">
            <h1 className={`${h1Classes} text-transparent select-none`} style={textStyle}>
              {WORD.map((char, i) => (
                <span
                  key={`hitbox-${i}`}
                  className="hitbox gpu-layer relative inline-block cursor-grab active:cursor-grabbing will-change-transform"
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>

          {/* FLOATING DECORATIONS */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-40 flex items-center justify-center">
            <div className="relative font-droid font-normal uppercase tracking-wide flex flex-row items-center justify-center" style={textStyle}>
              <span className="opacity-0">PORTFOLIO</span>

              <span
                className="badge-text absolute whitespace-nowrap text-[#EAE8E3] opacity-0 will-change-transform"
                style={{
                  fontFamily: "'Marker Felt', 'Comic Sans MS', 'Chalkboard SE', 'Ink Free', cursive",
                  fontSize: 'clamp(2rem, 5vw, 6rem)',
                  textTransform: 'none', lineHeight: 1,
                  bottom: '100%', left: 0,
                  marginBottom: 'clamp(2rem, 4vw, 6rem)',
                  transform: 'rotate(-4deg)', transformOrigin: 'bottom left'
                }}
              >
                Ayush Biju's
              </span>

              <span
                className="badge-text absolute whitespace-nowrap text-[#EAE8E3] opacity-0 will-change-transform"
                style={{
                  fontFamily: "'Marker Felt', 'Comic Sans MS', 'Chalkboard SE', 'Ink Free', cursive",
                  fontSize: 'clamp(2rem, 5vw, 6rem)',
                  textTransform: 'none', lineHeight: 1,
                  top: '100%', right: 0,
                  marginTop: 'clamp(2rem, 4vw, 6rem)',
                  transform: 'rotate(-4deg)', transformOrigin: 'top right'
                }}
              >
                2026
              </span>
            </div>
          </div>


          {/* MINIME STICKER */}
          <div
            className="minime-wrapper minime-entrance minime-position gpu-layer absolute pointer-events-auto z-50"
            style={{ cursor: 'grab', rotate: '-5deg' }}
          >
            <img
              src={minime}
              alt="Mini Me"
              loading="lazy"
              decoding="async"
              className="w-[clamp(8rem,15vw,20rem)] sticker-jiggle pointer-events-none select-none drop-shadow-lg"
            />
          </div>

        </div>
      </section>

      {/* ======================== ABOUT SECTION WRAPPER ======================== */}
      {/* z-[2] makes it slide OVER the sticky landing section — parallax cover effect */}
      <div className="relative z-[2]">

        {/* TORN EDGE: Highly chaotic, randomized path with irregular spacing and depth */}
        <div className="w-full h-[150px] relative pointer-events-none" style={{ marginBottom: '-2px' }}>
          <svg
            className="w-full h-full block"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 
                 L0,40 L15,20 L30,65 Q45,100 70,50 L85,120 L95,80 L120,45 L150,130 
                 Q185,150 210,95 L225,115 L240,40 L280,145 L310,80 L325,120 L350,20 
                 L400,100 Q440,140 480,55 L500,90 L515,30 L560,135 L600,60 L620,110 
                 L650,25 Q700,70 750,140 L780,90 L810,125 L840,40 L900,130 L930,70 
                 L960,115 L1000,30 L1050,145 L1100,50 L1130,90 L1160,20 L1220,135 
                 L1260,60 L1300,115 L1340,35 Q1390,80 1420,140 L1440,20 
                 V150 H0 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* ======================== ABOUT ME SECTION CONTENT ======================== */}
        <section id="about" className="w-full min-h-screen bg-white text-[#111111] pt-24 pb-24 px-8 md:px-20 lg:px-32">

          <div className="max-w-7xl mx-auto">

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-12 lg:gap-20 items-center">

              {/* Left: Bio & Details */}
              <div className="space-y-6 lg:space-y-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B0000] mb-4">
                    — About Me
                  </p>
                  <h2 className="font-droid text-[clamp(4rem,9vw,9rem)] leading-[1] uppercase text-[#111111] mb-8">
                    <div className="reveal-line-parent">
                      <div className="reveal-line">Ayush Biju</div>
                    </div>
                  </h2>
                  <div className="space-y-6 max-w-xl">
                    <p className="text-[clamp(1.1rem,1.4vw,1.3rem)] font-medium leading-tight text-[#111111]">
                      I am a passionate Full-Stack Web Developer and App Developer with a strong foundation in AI/ML.
                    </p>
                    <p className="text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed text-[#444444]">
                      As the Founder & Lead Developer of <strong>CoupleSpace</strong>, I build scalable applications using the MERN stack and React Native. I specialize in building custom chatbots, responsive websites, and implementing RAG-based AI solutions. Always eager to learn and innovate.
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 lg:gap-y-8 border-t border-black/10 pt-4 lg:pt-10">
                  {INFO_DATA.map(({ label, value }) => (
                    <div key={label} className="contact-info-item space-y-1">
                      <span className="text-[10px] uppercase tracking-widest font-black text-[#8B0000]/60">{label}</span>
                      <p className="text-sm font-bold text-[#111111]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: 3D Profile Frame & CTA */}
              <div className="flex flex-col items-center gap-6 lg:gap-12 pt-0 lg:pt-10 -mt-48 sm:-mt-56 md:mt-0 lg:mt-0">
                <div className="relative w-full aspect-[4/5] max-w-sm mx-auto">

                  {/* The Background Red Box - reduced height for better pop-out ratio */}
                  <div className="absolute bottom-0 left-0 w-full h-[70%] bg-[#8B0000] rounded-tl-[120px] shadow-2xl"></div>

                  {/* Container for images with overflow-visible to handle the 'left-hand' overflow */}
                  <div className="absolute inset-0 flex items-end justify-end overflow-visible">

                    {/* Main Image (bigme) - Aligned to right, overflowing from left */}
                    <img
                      src={bigme}
                      alt="Ayush Biju"
                      loading="lazy"
                      decoding="async"
                      className="w-[125%] max-w-none h-auto relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transform-gpu"
                    />

                    {/* Secondary Image (me) - Overlapping left side */}
                    <div className="absolute bottom-0 left-30 sm:-left-4 md:-left-12 lg:-left-24 w-[70%] sm:w-[75%] md:w-[85%] lg:w-[80%] h-auto z-20 select-none pointer-events-none transform-gpu">
                      <img
                        src={me}
                        alt="Me"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto drop-shadow-2xl sticker-bob"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Buttons - moved below image */}
                <div className="flex gap-6 w-full max-w-sm">
                  <button className="flex-1 px-8 py-4 bg-[#8B0000] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#111111] transition-all duration-300 shadow-xl">
                    Hire Me
                  </button>
                  <button className="flex-1 px-8 py-4 border-2 border-[#111111] text-[#111111] font-bold uppercase tracking-widest text-xs hover:bg-[#111111] hover:text-white transition-all duration-300 shadow-lg">
                    Projects
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ======================== EXPERIENCE SECTION ======================== */}
        <section id="experience" className="w-full bg-white text-[#111111] pb-48 px-8 md:px-20 lg:px-32 relative z-10" style={{ perspective: '2000px' }}>
          <div className="max-w-7xl mx-auto border-t-2 border-black/10 pt-24" style={{ transformStyle: 'preserve-3d' }}>

            {/* NOTICE CONTAINER: Fixed min-height prevents layout collapse on paper fall */}
            <div className="relative min-h-[500px] md:min-h-[700px] lg:min-h-[800px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

              {/* Hidden Layer (Fan & Coffee) - POSITIONED DIRECTLY BEHIND THE NOTICE */}
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-10">

                  {/* Rotating Fan Visual */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-48 h-48 border-[8px] border-black/5 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className={`w-40 h-40 transform-gpu ${isFanOn ? 'animate-fan-spin' : 'animate-fan-stop'}`}>
                        <circle cx="50" cy="50" r="8" fill="rgba(0,0,0,0.1)" />
                        <path d="M50,42 Q65,10 80,45 Q50,55 50,42 Z" fill="rgba(0,0,0,0.05)" />
                        <path d="M58,50 Q90,65 55,80 Q45,50 58,50 Z" fill="rgba(0,0,0,0.05)" />
                        <path d="M50,58 Q35,90 20,55 Q50,45 50,58 Z" fill="rgba(0,0,0,0.05)" />
                        <path d="M42,50 Q10,35 45,20 Q55,50 42,50 Z" fill="rgba(0,0,0,0.05)" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Industrial Fan Model-1997</span>
                  </div>

                  {/* Buy Me A Coffee - Brutalist Reveal Card */}
                  <div className="pointer-events-auto border-4 border-black/10 p-10 space-y-6 transform rotate-1 bg-white/50 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#8B0000] flex items-center justify-center text-white font-black text-2xl">☕</div>
                      <h4 className="font-droid text-4xl uppercase text-black/40 leading-none">Support<br />the dev</h4>
                    </div>
                    <p className="text-xs font-bold text-black/40 leading-relaxed uppercase tracking-widest border-l-4 border-[#8B0000]/20 pl-4">
                      Enjoying the interactive engineering? Your support helps keep this portfolio clean, quirky, and cutting-edge.
                    </p>
                    <button className="group w-full py-5 bg-[#111111]/5 border-2 border-black/10 text-black/40 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-all duration-500 shadow-sm hover:shadow-2xl">
                      Buy Me A Coffee
                    </button>
                  </div>
                </div>

                {/* Reset Button - Below Buy Me A Coffee */}
                <div className="mt-8 flex justify-center pointer-events-auto">
                  <button
                    onClick={handleReset}
                    className="px-10 py-4 border-4 border-black/20 text-black/40 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-all duration-500 shadow-sm hover:shadow-2xl flex items-center gap-3 relative z-20"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 4v6h6" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    Re-attach Notice
                  </button>
                </div>
              </div>

              {/* The "Red Paper" Notice */}
              <div
                ref={experienceNoticeRef}
                className="bg-[#8B0000] p-10 md:p-20 relative z-10 transform rotate-[-0.5deg] transform-gpu gpu-layer"
              >

                {/* Celotape Effect - Top Left (Bridging the corner) */}
                <div
                  className={`absolute top-[-30px] left-[-40px] w-64 h-16 bg-black/15 backdrop-blur-[1px] z-10 transform rotate-[-25deg] cursor-pointer transition-opacity duration-300 ${leftPeeled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLeftPeeled(true);
                  }}
                  style={{
                    clipPath: 'path("M5,10 C15,0 45,5 65,0 L245,10 C255,20 250,40 255,60 L5,55 C-5,45 5,25 0,10 Z")',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.08)',
                  }}
                ></div>

                {/* Celotape Effect - Top Right (Bridging the corner) */}
                <div
                  className={`absolute top-[-30px] right-[-40px] w-64 h-16 bg-black/15 backdrop-blur-[1px] z-10 transform rotate-[25deg] cursor-pointer transition-opacity duration-300 ${rightPeeled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRightPeeled(true);
                  }}
                  style={{
                    clipPath: 'path("M0,10 C10,0 40,5 60,0 L250,15 C260,25 255,45 260,65 L10,60 C0,50 10,30 5,10 Z")',
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.08)',
                  }}
                ></div>

                {/* Decorative "Pin" or Tape effect could go here, but keeping it brutalist */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 -mr-16 -mt-16 rounded-full blur-3xl pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">

                  {/* Left: Section Header & Switch */}
                  <div className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-12">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50 mb-4">— My Path</p>
                      <h2 className="font-droid text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] uppercase text-white">
                        Experience
                      </h2>
                    </div>

                    {/* Fan Switch & Instructions - High Visibility Sidebar */}
                    <div className="pt-10 border-t border-white/10 space-y-6">
                      <div className="space-y-2">
                        <p className="text-[11px] font-black text-[#8B0000] uppercase tracking-[0.2em] animate-pulse">
                          ⚠️ WARNING
                        </p>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                          The tapes are critical for stability.<br />
                          <span className="text-white">DO NOT REMOVE THEM.</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 bg-white/5 p-5 border border-white/10 hover:border-[#8B0000]/50 transition-colors group">
                        <label className="brutalist-switch">
                          <input
                            type="checkbox"
                            checked={isFanOn}
                            onChange={() => setIsFanOn(!isFanOn)}
                          />
                          <span className="slider"></span>
                        </label>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">
                            Wind Fan
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-tight ${isFanOn ? 'text-[#8B0000]' : 'text-white/30'}`}>
                            Status: {isFanOn ? 'ACTIVE' : 'OFFLINE'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Timeline items */}
                  <div className="lg:col-span-8 space-y-16">

                    {/* Milestone 1: Innovature */}
                    <div className="group relative pl-8 md:pl-16">
                      <div className="absolute left-0 top-0 w-[2px] h-full bg-white/20"></div>
                      <div className="absolute left-[-5px] top-4 w-3 h-3 bg-white rounded-full ring-4 ring-[#8B0000]"></div>

                      <div className="space-y-6">
                        <span className="inline-block px-4 py-1 bg-white text-[#111111] text-[10px] font-black uppercase tracking-widest">
                          Jan 2026 — Present
                        </span>

                        <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_#111111] transform group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                          <h3 className="font-droid text-3xl uppercase text-[#111111] leading-none mb-2">Software Intern</h3>
                          <p className="font-bold text-[#8B0000] mb-4">Innovature Software Labs (P) Ltd.</p>

                          <ul className="space-y-3 text-sm leading-relaxed text-[#444444]">
                            <li className="flex gap-3">
                              <span className="text-[#8B0000] font-black">/</span>
                              Selected for the post of Software Intern, starting from 16th January 2026.
                            </li>
                            <li className="flex gap-3">
                              <span className="text-[#8B0000] font-black">/</span>
                              Engaged in professional software development practices and contributing to company projects at the Kochi office.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Milestone 2: CoupleSpace */}
                    <div className="group relative pl-8 md:pl-16">
                      <div className="absolute left-0 top-0 w-[2px] h-full bg-white/20"></div>
                      <div className="absolute left-[-5px] top-4 w-3 h-3 bg-white rounded-full ring-4 ring-[#8B0000]"></div>

                      <div className="space-y-6">
                        <span className="inline-block px-4 py-1 bg-white text-[#111111] text-[10px] font-black uppercase tracking-widest">
                          Jan 2024 — Present
                        </span>

                        <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_#111111] transform group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                          <h3 className="font-droid text-3xl uppercase text-[#111111] leading-none mb-2">Founder & Lead Developer</h3>
                          <p className="font-bold text-[#8B0000] mb-4">CoupleSpace (Startup)</p>

                          <div className="space-y-4">
                            <p className="text-sm leading-relaxed text-[#444444]">
                              Developed CoupleSpace, a cross-platform relationship platform: mobile app (React Native) and web app (React) with a Node.js + MongoDB backend.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-[#f0f0f0] p-4 border border-black/5">
                                <span className="text-[10px] font-black uppercase text-[#8B0000] block mb-2">Features</span>
                                <ul className="text-[11px] space-y-1 text-[#555555]">
                                  <li>• Real-time Chat & Couple Profiles</li>
                                  <li>• Shared Events & Media Uploads</li>
                                  <li>• Secure JWT Authentication</li>
                                </ul>
                              </div>
                              <div className="bg-[#f0f0f0] p-4 border border-black/5">
                                <span className="text-[10px] font-black uppercase text-[#8B0000] block mb-2">Milestones</span>
                                <p className="text-[11px] text-[#555555]">Published on Play Store (Testing). Secured <strong className="text-[#111111]">₹80,000</strong> funding for development.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ======================== PROJECTS SECTION ======================== */}

        {/* TORN EDGE: White to Black Transition */}
        <div className="w-full h-[150px] relative pointer-events-none bg-white" style={{ marginBottom: '-4px' }}>
          <svg
            className="w-full h-full block translate-y-[1px]"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 
                 L0,60 L20,30 L45,100 Q60,130 90,60 L110,140 L125,90 L160,55 L190,145 
                 Q230,170 260,110 L280,135 L300,50 L350,155 L390,95 L410,140 L440,30 
                 L500,120 Q550,165 600,70 L625,115 L645,40 L700,150 L750,75 L775,130 
                 L815,35 Q875,90 940,150 L980,105 L1020,145 L1055,55 L1125,150 L1165,85 
                 L1200,140 L1250,45 L1310,155 L1365,70 L1410,145 L1440,30 
                 V150 H0 Z"
              fill="#111111"
            />
          </svg>
        </div>

        <section id="projects" className="w-full bg-[#111111] text-white pt-24 pb-48 px-8 md:px-20 lg:px-32">
          <div className="max-w-7xl mx-auto">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-24">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8B0000] mb-4">— My Works</p>
                <h2 className="font-droid text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] uppercase">
                  <div className="reveal-line-parent">
                    <div className="reveal-line">Featured</div>
                  </div>
                  <div className="reveal-line-parent">
                    <div className="reveal-line">Projects</div>
                  </div>
                </h2>
              </div>

              {/* DANCE VIDEO: Positioned "somewhat right" */}
              <div className="relative group max-w-xs w-full lg:mx-auto">
                <div className="absolute -inset-2 bg-white/5 blur-xl group-hover:bg-[#8B0000]/20 transition-all duration-700"></div>
                <div className="relative border-4 border-white bg-black aspect-square overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <video
                    src={medance}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover scale-110 grayscale hover:grayscale-0 transition-all duration-700 transform-gpu gpu-layer"
                  />
                  {/* Overlay branding */}
                  <div className="absolute top-2 left-2 bg-[#8B0000] text-white text-[8px] font-black px-2 py-0.5 tracking-tighter uppercase">REC</div>
                </div>
                {/* Visual anchor caption */}
                {/* <span className="absolute -bottom-6 right-0 text-[10px] font-bold text-white/30 uppercase tracking-widest italic">Medance.mp4</span> */}
              </div>

              <div className="max-w-xs flex flex-col gap-6">
                <p className="text-white/50 text-sm leading-relaxed uppercase tracking-widest border-l-2 border-[#8B0000] pl-6">
                  A selection of projects where I combine design aesthetics with robust engineering to solve real-world problems.
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

              {PROJECTS_DATA.map((project, index) => (
                <div key={index} className="project-card group relative">
                  <div className="border-[3px] border-white p-10 h-full flex flex-col justify-between hover:bg-[#8B0000] transition-colors duration-500">
                    <div>
                      <div className="flex justify-between items-start mb-12">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-[#8B0000] pb-1">
                          {project.year}
                        </span>
                        <div className="w-8 h-8 flex items-center justify-center border border-white/20 group-hover:border-white transition-colors">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:rotate-45 transition-transform duration-300">
                            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>

                      <h3 className="font-droid text-3xl uppercase leading-none mb-6">
                        {project.title}
                      </h3>

                      <p className="text-white/60 group-hover:text-white/90 text-sm leading-relaxed mb-8">
                        {project.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10 uppercase font-bold text-[9px] tracking-widest">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/5 group-hover:bg-black/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ======================== GET IN TOUCH SECTION ======================== */}

        {/* TORN EDGE: Black to Dark Transition */}
        <div className="w-full h-[150px] relative pointer-events-none bg-[#111111]" style={{ marginBottom: '-2px' }}>
          <svg
            className="w-full h-full block"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 
                 L0,50 L25,25 L55,90 Q75,120 105,55 L120,130 L140,80 L175,45 L210,140 
                 Q250,160 285,100 L305,125 L325,45 L375,150 L415,85 L435,130 L470,25 
                 L530,110 Q575,155 625,65 L650,105 L670,35 L725,145 L775,65 L800,120 
                 L840,30 Q900,85 965,145 L1005,95 L1045,135 L1080,50 L1150,145 L1190,80 
                 L1225,130 L1275,40 L1340,150 L1390,65 L1435,140 L1440,25
                 V150 H0 Z"
              fill="#0a0a0a"
            />
          </svg>
        </div>

        <section id="contact" className="w-full bg-[#0a0a0a] text-white pt-24 pb-32 px-8 md:px-20 lg:px-32 relative overflow-hidden">

          {/* Background decorative elements */}
          <div className="contact-glow-1 absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B0000]/3 rounded-full blur-[200px] pointer-events-none"></div>
          <div className="contact-glow-2 absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B0000]/5 rounded-full blur-[150px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto">

            {/* Section Header */}
            <div className="contact-header-border mb-24 border-b border-white/10 pb-16">
              <p className="contact-subtitle text-xs font-bold uppercase tracking-[0.3em] text-[#8B0000] mb-4">— Let's Connect</p>
              <h2 className="font-droid text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] uppercase">
                <div className="reveal-line-parent">
                  <div className="reveal-line">Get In</div>
                </div>
                <div className="reveal-line-parent">
                  <div className="reveal-line">Touch</div>
                </div>
              </h2>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

              {/* LEFT: Contact Info */}
              <div className="space-y-12">

                <p className="contact-subtitle text-white/50 text-sm leading-relaxed uppercase tracking-widest border-l-2 border-[#8B0000] pl-6 max-w-md">
                  Have a project in mind or want to collaborate? I'd love to hear from you. Reach out and let's create something remarkable together.
                </p>

                <div className="space-y-10 pt-4">

                  {/* Location */}
                  <div className="contact-info-item group flex items-start gap-6">
                    <div className="contact-icon-box w-14 h-14 flex items-center justify-center border-[3px] border-white bg-transparent group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-all duration-500 shadow-[4px_4px_0px_#8B0000] flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000]">Location</span>
                      <p className="text-lg font-bold text-white/90">Kothamangalam, Kerala, India</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="contact-info-item group flex items-start gap-6">
                    <div className="contact-icon-box w-14 h-14 flex items-center justify-center border-[3px] border-white bg-transparent group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-all duration-500 shadow-[4px_4px_0px_#8B0000] flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 4l-10 8L2 4" />
                      </svg>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000]">Email</span>
                      <a href="mailto:ayushbiju8@gmail.com" className="text-lg font-bold text-white/90 hover:text-[#8B0000] transition-colors duration-300 block">ayushbiju8@gmail.com</a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="contact-info-item group flex items-start gap-6">
                    <div className="contact-icon-box w-14 h-14 flex items-center justify-center border-[3px] border-white bg-transparent group-hover:bg-[#8B0000] group-hover:border-[#8B0000] transition-all duration-500 shadow-[4px_4px_0px_#8B0000] flex-shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000]">Call</span>
                      <a href="tel:+918590679146" className="text-lg font-bold text-white/90 hover:text-[#8B0000] transition-colors duration-300 block">+91 8590679146</a>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT: Contact Form */}
              <div className="contact-form-card relative">
                <div className="border-[3px] border-white p-10 md:p-14 shadow-[8px_8px_0px_#8B0000] bg-white/[0.02] backdrop-blur-sm">

                  <h3 className="contact-form-title font-droid text-3xl uppercase leading-none mb-10 text-white">
                    Send A Message
                  </h3>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      setSubmitResult("");
                      const formData = new FormData(e.target);
                      formData.append("access_key", "bd08bab1-b11a-4b83-aef5-92e7044577fe");

                      try {
                        const response = await fetch("https://api.web3forms.com/submit", {
                          method: "POST",
                          body: formData
                        });
                        const data = await response.json();
                        if (data.success) {
                          setSubmitResult("Message sent successfully!");
                          e.target.reset();
                        } else {
                          setSubmitResult("Something went wrong. Please try again.");
                        }
                      } catch (error) {
                        setSubmitResult("Error connecting. Please try again.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="space-y-8"
                  >
                    {/* Name Field */}
                    <div className="contact-form-field space-y-2">
                      <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000] block">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your Name"
                        required
                        className="w-full bg-transparent border-b-2 border-white/20 text-white text-sm font-bold py-4 px-0 placeholder-white/20 focus:border-[#8B0000] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="contact-form-field space-y-2">
                      <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000] block">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Your Email"
                        required
                        className="w-full bg-transparent border-b-2 border-white/20 text-white text-sm font-bold py-4 px-0 placeholder-white/20 focus:border-[#8B0000] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    {/* Message Field */}
                    <div className="contact-form-field space-y-2">
                      <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000] block">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        placeholder="How can I help you?"
                        required
                        className="w-full bg-transparent border-b-2 border-white/20 text-white text-sm font-bold py-4 px-0 placeholder-white/20 focus:border-[#8B0000] focus:outline-none transition-colors duration-300 resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Result Message */}
                    {submitResult && (
                      <div className={`text-sm font-bold tracking-widest uppercase ${submitResult.includes('successfully') ? 'text-green-500' : 'text-[#8B0000]'}`}>
                        {submitResult}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="contact-submit-btn cursor-pointer group w-full py-5 bg-[#8B0000] border-[3px] border-[#8B0000] text-white font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-[#111111] hover:border-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-[4px_4px_0px_white] hover:shadow-[6px_6px_0px_#8B0000] active:shadow-[2px_2px_0px_#8B0000] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <span className="inline-block ml-3 transform group-hover:translate-x-2 transition-transform duration-300">→</span>}
                    </button>
                  </form>
                </div>

                {/* Decorative corner accent */}
                <div className="contact-corner-accent absolute -top-4 -right-4 w-8 h-8 border-t-[3px] border-r-[3px] border-[#8B0000] pointer-events-none"></div>
                <div className="contact-corner-accent absolute -bottom-4 -left-4 w-8 h-8 border-b-[3px] border-l-[3px] border-[#8B0000] pointer-events-none"></div>
              </div>

            </div>
          </div>
        </section>

        {/* ======================== FOOTER SECTION ======================== */}

        {/* TORN EDGE: Dark to Footer Transition */}
        <div className="w-full h-[120px] relative pointer-events-none bg-[#0a0a0a]" style={{ marginBottom: '-2px' }}>
          <svg
            className="w-full h-full block"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 
                 L0,35 L18,15 L40,75 Q55,95 80,40 L95,100 L110,60 L140,30 L170,110 
                 Q200,130 230,80 L250,100 L270,35 L320,115 L355,70 L375,105 L405,20 
                 L460,90 Q500,125 545,50 L570,85 L590,25 L640,110 L685,48 L710,95 
                 L745,22 Q800,65 855,115 L890,75 L925,110 L955,38 L1025,120 L1060,65 
                 L1095,105 L1140,32 L1210,118 L1255,52 L1300,108 L1345,28 Q1395,68 1420,115 L1440,18 
                 V120 H0 Z"
              fill="#050505"
            />
          </svg>
        </div>

        <footer id="footer" ref={footerRef} className="w-full bg-[#050505] text-white relative overflow-hidden">

          {/* Ambient background glows */}
          <div className="footer-glow-1 absolute top-20 right-0 w-[500px] h-[500px] bg-[#8B0000]/3 rounded-full blur-[200px] pointer-events-none"></div>
          <div className="footer-glow-2 absolute bottom-0 left-10 w-[350px] h-[350px] bg-[#8B0000]/4 rounded-full blur-[160px] pointer-events-none"></div>

          <div className="w-full overflow-hidden border-b border-white/5 py-5">
            <div className="footer-marquee-inner flex whitespace-nowrap will-change-transform" style={{ width: 'fit-content' }}>
              {[...Array(24)].map((_, i) => (
                <span key={i} className="text-[clamp(0.7rem,1vw,0.9rem)] font-black uppercase tracking-[0.5em] text-white/[0.04] mx-8 shrink-0">
                  DESIGN • DEVELOP • DEPLOY • INNOVATE •
                </span>
              ))}
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-8 md:px-20 lg:px-32 pt-12 pb-10">



            {/* Divider */}
            <div className="footer-divider w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B0000] to-transparent mb-16"></div>

            {/* Middle: Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12">

              {/* Navigation */}
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000] block">Navigation</span>
                <nav className="space-y-4">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        const targetId = link.href === '#' ? '#home' : link.href;
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: 'smooth' });
                        } else if (link.href === '#') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="footer-nav-link cursor-pointer group flex items-center gap-3 text-white/40 hover:text-white text-sm font-bold uppercase tracking-widest transition-all duration-300"
                    >
                      <span className="w-0 h-[2px] bg-[#8B0000] group-hover:w-6 transition-all duration-300"></span>
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Tech Stack */}
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000] block">Tech Stack</span>
                <div className="space-y-4">
                  {TECH_STACK.map((tech) => (
                    <p key={tech} className="footer-nav-link text-white/40 text-sm font-bold uppercase tracking-widest">
                      {tech}
                    </p>
                  ))}
                </div>
              </div>

              {/* Connect */}
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B0000] block">Connect</span>
                <div className="flex gap-4 flex-wrap">
                  {/* GitHub */}
                  <a
                    href="https://github.com/ayushbiju8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon cursor-pointer group w-14 h-14 flex items-center justify-center border-[3px] border-white/20 bg-transparent hover:bg-[#8B0000] hover:border-[#8B0000] transition-all duration-500 shadow-[3px_3px_0px_rgba(139,0,0,0.3)] hover:shadow-[5px_5px_0px_#8B0000]"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/60 group-hover:text-white transition-colors">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/ayushbiju"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon cursor-pointer group w-14 h-14 flex items-center justify-center border-[3px] border-white/20 bg-transparent hover:bg-[#8B0000] hover:border-[#8B0000] transition-all duration-500 shadow-[3px_3px_0px_rgba(139,0,0,0.3)] hover:shadow-[5px_5px_0px_#8B0000]"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/60 group-hover:text-white transition-colors">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/ayushbiju"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon cursor-pointer group w-14 h-14 flex items-center justify-center border-[3px] border-white/20 bg-transparent hover:bg-[#8B0000] hover:border-[#8B0000] transition-all duration-500 shadow-[3px_3px_0px_rgba(139,0,0,0.3)] hover:shadow-[5px_5px_0px_#8B0000]"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/60 group-hover:text-white transition-colors">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  {/* X/Twitter */}
                  <a
                    href="https://x.com/ayushbiju"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon cursor-pointer group w-14 h-14 flex items-center justify-center border-[3px] border-white/20 bg-transparent hover:bg-[#8B0000] hover:border-[#8B0000] transition-all duration-500 shadow-[3px_3px_0px_rgba(139,0,0,0.3)] hover:shadow-[5px_5px_0px_#8B0000]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/60 group-hover:text-white transition-colors">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>

                {/* Quick contact */}
                <div className="space-y-3 pt-4">
                  <a href="mailto:ayushbiju8@gmail.com" className="footer-nav-link text-white/40 hover:text-[#8B0000] text-sm font-bold transition-colors duration-300 block">
                    ayushbiju8@gmail.com
                  </a>
                  <a href="tel:+918590679146" className="footer-nav-link text-white/40 hover:text-[#8B0000] text-sm font-bold transition-colors duration-300 block">
                    +91 8590679146
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom-bar border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-white/20 text-[11px] font-bold uppercase tracking-[0.3em]">
                © {currentYear} Ayush Biju. All Rights Reserved.
              </p>

              <p className="text-white/10 text-[10px] font-bold uppercase tracking-[0.2em]">
                Designed & Built with ♥ & Brutalism
              </p>

              {/* Back to Top */}
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="footer-back-top group flex items-center gap-3 px-6 py-3 border-[2px] border-white/10 text-white/30 hover:border-[#8B0000] hover:text-white hover:bg-[#8B0000] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-[3px_3px_0px_rgba(139,0,0,0.2)] hover:shadow-[5px_5px_0px_#8B0000]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-y-1 transition-transform duration-300">
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
                Back to Top
              </button>
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="footer-corner absolute top-8 left-8 w-10 h-10 border-t-[3px] border-l-[3px] border-[#8B0000]/20 pointer-events-none"></div>
          <div className="footer-corner absolute top-8 right-8 w-10 h-10 border-t-[3px] border-r-[3px] border-[#8B0000]/20 pointer-events-none"></div>
          <div className="footer-corner absolute bottom-8 left-8 w-10 h-10 border-b-[3px] border-l-[3px] border-[#8B0000]/20 pointer-events-none"></div>
          <div className="footer-corner absolute bottom-8 right-8 w-10 h-10 border-b-[3px] border-r-[3px] border-[#8B0000]/20 pointer-events-none"></div>

        </footer>
      </div>

    </div>
  );
}

export default App;
