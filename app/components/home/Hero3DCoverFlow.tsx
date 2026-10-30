import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export interface CoverFlowItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  link: string;
}

interface Hero3DCoverFlowProps {
  items: CoverFlowItem[];
}

export function Hero3DCoverFlow({ items }: Hero3DCoverFlowProps) {
  const navigate = useNavigate();

  // Replicate array to ensure a seamless circular 3D track without popping
  const carouselItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    return [...items, ...items.map((it, idx) => ({ ...it, id: `${it.id}-clone-${idx}` }))];
  }, [items]);

  const totalItems = carouselItems.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeCenterIndex, setActiveCenterIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // References for live physics state
  const physicsRef = useRef({
    scrollX: 0,
    velocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartScrollX: 0,
    lastPointerX: 0,
    lastPointerTime: 0,
    isSnapping: false,
    targetSnapScrollX: 0,
    isHovered: false,
    isWheeling: false,
    lastInteractionTime: 0,
    wheelTimeout: null as any,
    isAutoScrolling: true,
  });

  // Keep physics auto-scroll in sync with state
  useEffect(() => {
    physicsRef.current.isAutoScrolling = isAutoScrolling;
    if (isAutoScrolling) {
      physicsRef.current.lastInteractionTime = performance.now();
    }
  }, [isAutoScrolling]);

  const snapToCardIndex = useCallback((index: number) => {
    if (!trackRef.current) return;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 220 : 300;
    const cardGap = isMobile ? 20 : 36;
    const itemSpacing = cardWidth + cardGap;
    const totalTrackWidth = totalItems * itemSpacing;

    const currentScrollX = physicsRef.current.scrollX;
    let dist = (index * itemSpacing - currentScrollX) % totalTrackWidth;
    if (dist > totalTrackWidth / 2) dist -= totalTrackWidth;
    if (dist < -totalTrackWidth / 2) dist += totalTrackWidth;

    physicsRef.current.targetSnapScrollX = currentScrollX + dist;
    physicsRef.current.isSnapping = true;
    physicsRef.current.velocity = 0;
    physicsRef.current.lastInteractionTime = performance.now();
  }, [totalItems]);

  const handlePrev = () => {
    const prevIdx = (activeCenterIndex - 1 + totalItems) % totalItems;
    snapToCardIndex(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeCenterIndex + 1) % totalItems;
    snapToCardIndex(nextIdx);
  };

  useEffect(() => {
    if (!stageRef.current || !trackRef.current || totalItems === 0) return;

    const stageEl = stageRef.current;
    const trackEl = trackRef.current;
    const cardElements = Array.from(trackEl.querySelectorAll<HTMLElement>(".flow-card"));

    const CONFIG = {
      autoScrollSpeed: 44, // Horizontal auto-scroll speed in pixels per second
      friction: 0.93, // Decay momentum per frame
      dragSensitivity: 1.15,
      wheelSensitivity: 0.8,
      resumeDelay: 850, // ms of inactivity before resuming auto-scroll
      snapSpring: 0.08, // spring stiffness
      perspective: 1400,
      cardWidthDesktop: 300,
      cardHeightDesktop: 410,
      cardWidthMobile: 220,
      cardHeightMobile: 300,
      cardGapDesktop: 36,
      cardGapMobile: 20,
      cardBorderRadius: 28,
      maxRotationDesktop: 28, // Max Y-axis rotation in degrees on desktop
      maxRotationMobile: 12, // Max Y-axis rotation on mobile
      centerScale: 1.0,
      minScaleDesktop: 0.74,
      minScaleMobile: 0.82,
      minTranslateZDesktop: -220,
      minTranslateZMobile: -110,
      centerOpacity: 1.0,
      minOpacity: 0.55,
      minBrightnessOverlay: 0.35,
      influenceRangeDesktop: 2.4,
      influenceRangeMobile: 1.6,
    };

    let layoutMetrics = {
      isMobile: false,
      cardWidth: CONFIG.cardWidthDesktop,
      cardHeight: CONFIG.cardHeightDesktop,
      cardGap: CONFIG.cardGapDesktop,
      itemSpacing: CONFIG.cardWidthDesktop + CONFIG.cardGapDesktop,
      totalTrackWidth: totalItems * (CONFIG.cardWidthDesktop + CONFIG.cardGapDesktop),
      maxRotation: CONFIG.maxRotationDesktop,
      minScale: CONFIG.minScaleDesktop,
      minTranslateZ: CONFIG.minTranslateZDesktop,
      influenceDistance: (CONFIG.cardWidthDesktop + CONFIG.cardGapDesktop) * CONFIG.influenceRangeDesktop,
    };

    function updateDimensions() {
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? CONFIG.cardWidthMobile : CONFIG.cardWidthDesktop;
      const cardHeight = isMobile ? CONFIG.cardHeightMobile : CONFIG.cardHeightDesktop;
      const cardGap = isMobile ? CONFIG.cardGapMobile : CONFIG.cardGapDesktop;
      const itemSpacing = cardWidth + cardGap;
      const totalTrackWidth = totalItems * itemSpacing;
      const maxRotation = isMobile ? CONFIG.maxRotationMobile : CONFIG.maxRotationDesktop;
      const minScale = isMobile ? CONFIG.minScaleMobile : CONFIG.minScaleDesktop;
      const minTranslateZ = isMobile ? CONFIG.minTranslateZMobile : CONFIG.minTranslateZDesktop;
      const influenceDistance = itemSpacing * (isMobile ? CONFIG.influenceRangeMobile : CONFIG.influenceRangeDesktop);

      layoutMetrics = {
        isMobile,
        cardWidth,
        cardHeight,
        cardGap,
        itemSpacing,
        totalTrackWidth,
        maxRotation,
        minScale,
        minTranslateZ,
        influenceDistance,
      };

      stageEl.style.perspective = `${CONFIG.perspective}px`;

      cardElements.forEach((card) => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.style.marginLeft = `${-cardWidth / 2}px`;
        card.style.marginTop = `${-cardHeight / 2}px`;
        card.style.borderRadius = `${CONFIG.cardBorderRadius}px`;
      });
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    let animationFrameId: number;
    let lastFrameTime = performance.now();
    physicsRef.current.lastInteractionTime = performance.now();

    function renderLoop(currentTime: number) {
      const dt = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
      lastFrameTime = currentTime;

      const p = physicsRef.current;
      const { itemSpacing, totalTrackWidth, maxRotation, minScale, minTranslateZ, influenceDistance } = layoutMetrics;

      // 1. Position update & velocity physics
      if (p.isDragging) {
        // Direct manipulation by pointer
      } else if (p.isSnapping) {
        const snapDiff = p.targetSnapScrollX - p.scrollX;
        if (Math.abs(snapDiff) > 0.4) {
          p.scrollX += snapDiff * (1 - Math.exp(-CONFIG.snapSpring * dt * 60));
        } else {
          p.scrollX = p.targetSnapScrollX;
          p.isSnapping = false;
        }
      } else {
        if (Math.abs(p.velocity) > 0.5) {
          p.scrollX += p.velocity * dt;
          p.velocity *= Math.pow(CONFIG.friction, dt * 60);
        } else {
          p.velocity = 0;
          const timeSinceInteraction = currentTime - p.lastInteractionTime;
          if (p.isAutoScrolling && !p.isHovered && !p.isWheeling && timeSinceInteraction > CONFIG.resumeDelay) {
            p.scrollX += CONFIG.autoScrollSpeed * dt;
          }
        }
      }

      // Wrap scrollX continuously
      p.scrollX = ((p.scrollX % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;

      // 2. Compute 3D positions, tilt, scale, opacity
      let closestDist = Infinity;
      let centerCandidateIdx = 0;

      cardElements.forEach((card, i) => {
        let dist = (i * itemSpacing - p.scrollX) % totalTrackWidth;
        if (dist > totalTrackWidth / 2) dist -= totalTrackWidth;
        if (dist < -totalTrackWidth / 2) dist += totalTrackWidth;

        const absDist = Math.abs(dist);
        if (absDist < closestDist) {
          closestDist = absDist;
          centerCandidateIdx = i;
        }

        const norm = Math.min(1.0, absDist / influenceDistance);
        const rotCurve = Math.pow(Math.min(1.2, absDist / (itemSpacing * 1.8)), 0.9);
        const scaleCurve = Math.pow(norm, 1.15);
        const zCurve = Math.pow(norm, 1.1);
        const opacityCurve = Math.pow(norm, 1.3);

        const sign = dist >= 0 ? -1 : 1;
        const rotateY = sign * Math.min(maxRotation, rotCurve * maxRotation);
        const scale = CONFIG.centerScale - (CONFIG.centerScale - minScale) * scaleCurve;
        const translateZ = minTranslateZ * zCurve;
        const opacity = CONFIG.centerOpacity - (CONFIG.centerOpacity - CONFIG.minOpacity) * opacityCurve;
        const overlayOpacity = CONFIG.minBrightnessOverlay * norm;
        const zIndex = Math.max(1, Math.round(1000 - absDist));

        card.style.transform = `translate3d(${dist.toFixed(2)}px, 0px, ${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex.toString();

        const dimOverlay = card.querySelector<HTMLElement>(".card-dim-overlay");
        if (dimOverlay) {
          dimOverlay.style.opacity = overlayOpacity.toFixed(3);
        }

        const badge = card.querySelector<HTMLElement>(".card-center-badge");
        if (badge) {
          const badgeOpacity = Math.max(0, 1 - absDist / (itemSpacing * 0.75));
          badge.style.opacity = badgeOpacity.toFixed(3);
          badge.style.pointerEvents = badgeOpacity > 0.6 ? "auto" : "none";
        }
      });

      if (centerCandidateIdx !== activeCenterIndex) {
        setActiveCenterIndex(centerCandidateIdx);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    // Pointer Drag Listeners
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      const p = physicsRef.current;
      p.isDragging = true;
      p.isSnapping = false;
      p.dragStartX = e.clientX;
      p.dragStartScrollX = p.scrollX;
      p.lastPointerX = e.clientX;
      p.lastPointerTime = performance.now();
      p.velocity = 0;
      p.lastInteractionTime = performance.now();
      try {
        stageEl.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = physicsRef.current;
      if (!p.isDragging) return;

      const now = performance.now();
      const currentX = e.clientX;
      const deltaX = currentX - p.lastPointerX;
      const dt = Math.max(1, now - p.lastPointerTime) / 1000;

      p.scrollX -= deltaX * CONFIG.dragSensitivity;
      p.velocity = -deltaX / dt;

      p.lastPointerX = currentX;
      p.lastPointerTime = now;
      p.lastInteractionTime = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      const p = physicsRef.current;
      if (!p.isDragging) return;
      p.isDragging = false;
      p.lastInteractionTime = performance.now();
      try {
        stageEl.releasePointerCapture(e.pointerId);
      } catch (err) {}
      p.velocity = Math.max(-1200, Math.min(1200, p.velocity));
    };

    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : e.deltaX;
      if (Math.abs(delta) > 2) {
        e.preventDefault();
        const p = physicsRef.current;
        p.isWheeling = true;
        p.isSnapping = false;
        p.scrollX += delta * CONFIG.wheelSensitivity;
        p.velocity = delta * 12;
        p.lastInteractionTime = performance.now();

        clearTimeout(p.wheelTimeout);
        p.wheelTimeout = setTimeout(() => {
          p.isWheeling = false;
          p.lastInteractionTime = performance.now();
        }, 180);
      }
    };

    const onMouseEnter = () => {
      physicsRef.current.isHovered = true;
    };

    const onMouseLeave = () => {
      physicsRef.current.isHovered = false;
      physicsRef.current.lastInteractionTime = performance.now();
    };

    stageEl.addEventListener("pointerdown", onPointerDown);
    stageEl.addEventListener("pointermove", onPointerMove);
    stageEl.addEventListener("pointerup", onPointerUp);
    stageEl.addEventListener("pointercancel", onPointerUp);
    stageEl.addEventListener("wheel", onWheel, { passive: false });
    stageEl.addEventListener("mouseenter", onMouseEnter);
    stageEl.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(animationFrameId);
      stageEl.removeEventListener("pointerdown", onPointerDown);
      stageEl.removeEventListener("pointermove", onPointerMove);
      stageEl.removeEventListener("pointerup", onPointerUp);
      stageEl.removeEventListener("pointercancel", onPointerUp);
      stageEl.removeEventListener("wheel", onWheel);
      stageEl.removeEventListener("mouseenter", onMouseEnter);
      stageEl.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [totalItems, activeCenterIndex]);

  // Click on card handler: center if outer; explore link if centered
  const handleCardClick = (index: number, link: string) => {
    if (Math.abs(physicsRef.current.velocity) > 30) return;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 220 : 300;
    const cardGap = isMobile ? 20 : 36;
    const itemSpacing = cardWidth + cardGap;
    const totalTrackWidth = totalItems * itemSpacing;

    let dist = (index * itemSpacing - physicsRef.current.scrollX) % totalTrackWidth;
    if (dist > totalTrackWidth / 2) dist -= totalTrackWidth;
    if (dist < -totalTrackWidth / 2) dist += totalTrackWidth;

    if (Math.abs(dist) < 16) {
      // Already centered: navigate to product drape!
      navigate(link);
    } else {
      // Snap to center
      snapToCardIndex(index);
    }
  };

  const rawActiveIdx = activeCenterIndex % (items.length || 1);
  const currentItem = items[rawActiveIdx] || items[0];

  return (
    <div className="relative w-full overflow-hidden select-none py-2 sm:py-4">
      {/* 3D Perspective Stage Container */}
      <div
        ref={stageRef}
        className="carousel-perspective-stage relative w-full h-[360px] sm:h-[440px] lg:h-[480px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
      >
        {/* Soft Side Vignette Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-r from-brand-ivory via-brand-ivory/80 to-transparent z-40 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-l from-brand-ivory via-brand-ivory/80 to-transparent z-40 pointer-events-none" />

        {/* Carousel 3D Track */}
        <div ref={trackRef} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {carouselItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flow-card flow-card-shadow overflow-hidden bg-brand-ivory flex flex-col justify-end p-4 sm:p-5"
              onClick={() => handleCardClick(idx, item.link)}
              role="button"
              tabIndex={0}
              aria-label={`${item.title} — ${item.subtitle}`}
            >
              {/* Saree Drape Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                loading={idx < 6 ? "eager" : "lazy"}
                draggable={false}
              />

              {/* Luxury Silk/Glass Sheen */}
              <div className="absolute inset-0 flow-card-sheen pointer-events-none" />

              {/* Periphery Dim Vignette Overlay */}
              <div
                className="card-dim-overlay absolute inset-0 bg-[#2A1235] pointer-events-none transition-opacity duration-75"
                style={{ opacity: 0 }}
              />

              {/* Active Center Card Label Badge */}
              <div
                className="card-center-badge relative z-10 p-3 sm:p-4 rounded-[18px] bg-brand-ivory/95 backdrop-blur-md border border-white/50 text-brand-deepPlum shadow-md transition-opacity duration-150"
                style={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-brand-deepPlum text-brand-gold shadow-xs">
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-brand-plum font-serif italic">
                    Pure Silk Weave
                  </span>
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold leading-tight text-brand-deepPlum">
                  {item.title}
                </h4>
                <p className="text-[11px] text-brand-deepPlum/70 font-sans truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Rotation Guide Pill */}
        <div className="absolute inset-x-0 bottom-2 pointer-events-none flex justify-center items-center z-30">
          <div className="px-3.5 py-1 rounded-full bg-brand-ivory/85 backdrop-blur-xs border border-brand-lilac/35 text-[10px] tracking-wider uppercase text-brand-deepPlum/70 flex items-center gap-2 shadow-2xs">
            <span>← Drag or Wheel to Rotate Gallery →</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Active Item Metadata Bar */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-brand-lilac/25">
        {/* Active Center Card Metadata Display */}
        <div className="flex items-center gap-3 text-left">
          <span className="font-serif text-lg text-brand-deepPlum font-semibold">
            {String(rawActiveIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <div className="w-[1px] h-6 bg-brand-lilac/40" />
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-brand-deepPlum">
              {currentItem?.title}
            </div>
            <div className="text-[11px] text-brand-deepPlum/65 font-sans">
              {currentItem?.subtitle} • {currentItem?.tag}
            </div>
          </div>
        </div>

        {/* Arrow Navigation & Auto-Scroll Controller */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Previous Card Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous saree"
            className="w-9 h-9 rounded-full bg-white hover:bg-brand-ivory border border-brand-lilac/50 flex items-center justify-center text-brand-deepPlum transition-all shadow-xs hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Toggle Auto-Scroll Button */}
          <button
            type="button"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            aria-label="Toggle auto-scrolling"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-white/90 hover:bg-white border border-brand-lilac/50 text-brand-deepPlum transition-all shadow-xs"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAutoScrolling ? "bg-emerald-600 animate-pulse" : "bg-amber-600"
              }`}
            />
            <span>{isAutoScrolling ? "Auto-Scroll" : "Paused"}</span>
          </button>

          {/* Next Card Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next saree"
            className="w-9 h-9 rounded-full bg-white hover:bg-brand-ivory border border-brand-lilac/50 flex items-center justify-center text-brand-deepPlum transition-all shadow-xs hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Direct Drape Explore Link */}
          {currentItem && (
            <Link
              to={currentItem.link}
              className="ml-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-deepPlum text-white hover:bg-brand-plum transition-all shadow-xs"
            >
              Explore Drape ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
