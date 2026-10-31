import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  // Duplicate items to create a smooth circular cover flow stage without dead ends
  const carouselItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    return [...items, ...items.map((it, idx) => ({ ...it, id: `${it.id}-c2-${idx}` }))];
  }, [items]);

  const totalItems = carouselItems.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeCenterIndex, setActiveCenterIndex] = useState(0);

  // Live physics state for 60fps rAF loop
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
    wheelTimeout: null as any,
  });

  const snapToCardIndex = useCallback((index: number) => {
    if (!trackRef.current) return;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 228 : 310;
    const cardGap = isMobile ? 24 : 36;
    const itemSpacing = cardWidth + cardGap;
    const totalTrackWidth = totalItems * itemSpacing;

    const currentScrollX = physicsRef.current.scrollX;
    let dist = (index * itemSpacing - currentScrollX) % totalTrackWidth;
    if (dist > totalTrackWidth / 2) dist -= totalTrackWidth;
    if (dist < -totalTrackWidth / 2) dist += totalTrackWidth;

    physicsRef.current.targetSnapScrollX = currentScrollX + dist;
    physicsRef.current.isSnapping = true;
    physicsRef.current.velocity = 0;
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
      friction: 0.92, // Momentum decay per frame
      dragSensitivity: 1.18,
      wheelSensitivity: 0.85,
      snapSpring: 0.12, // Crisp snap spring stiffness
      snapTriggerVelocity: 16, // Velocity below which auto-snap activates
      perspective: 1100, // Dramatic perspective depth
      cardWidthDesktop: 310,
      cardHeightDesktop: 420,
      cardWidthMobile: 228,
      cardHeightMobile: 330,
      cardGapDesktop: 36,
      cardGapMobile: 24,
      cardBorderRadiusDesktop: 28,
      cardBorderRadiusMobile: 24,
      // High dramatic tilt matching user request (same dramatic 3D on mobile)
      maxRotationDesktop: 42, // 42° tilt on desktop
      maxRotationMobile: 40,  // 40° tilt on mobile (parity with desktop)
      maxFanRollDesktop: 2.5, // Subtle rotateZ arching
      maxFanRollMobile: 2.0,
      centerScale: 1.0,
      minScaleDesktop: 0.76,
      minScaleMobile: 0.80,
      minTranslateZDesktop: -290,
      minTranslateZMobile: -190,
      centerOpacity: 1.0,
      minOpacity: 0.45,
      minBrightnessOverlay: 0.42,
      influenceRangeDesktop: 2.4,
      influenceRangeMobile: 1.7,
      lenticularParallaxShift: 16, // px of counter-parallax inside image
    };

    let layoutMetrics = {
      isMobile: false,
      cardWidth: CONFIG.cardWidthDesktop,
      cardHeight: CONFIG.cardHeightDesktop,
      cardGap: CONFIG.cardGapDesktop,
      itemSpacing: CONFIG.cardWidthDesktop + CONFIG.cardGapDesktop,
      totalTrackWidth: totalItems * (CONFIG.cardWidthDesktop + CONFIG.cardGapDesktop),
      maxRotation: CONFIG.maxRotationDesktop,
      maxFanRoll: CONFIG.maxFanRollDesktop,
      minScale: CONFIG.minScaleDesktop,
      minTranslateZ: CONFIG.minTranslateZDesktop,
      influenceDistance: (CONFIG.cardWidthDesktop + CONFIG.cardGapDesktop) * CONFIG.influenceRangeDesktop,
      cardBorderRadius: CONFIG.cardBorderRadiusDesktop,
    };

    function updateDimensions() {
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? CONFIG.cardWidthMobile : CONFIG.cardWidthDesktop;
      const cardHeight = isMobile ? CONFIG.cardHeightMobile : CONFIG.cardHeightDesktop;
      const cardGap = isMobile ? CONFIG.cardGapMobile : CONFIG.cardGapDesktop;
      const itemSpacing = cardWidth + cardGap;
      const totalTrackWidth = totalItems * itemSpacing;
      const maxRotation = isMobile ? CONFIG.maxRotationMobile : CONFIG.maxRotationDesktop;
      const maxFanRoll = isMobile ? CONFIG.maxFanRollMobile : CONFIG.maxFanRollDesktop;
      const minScale = isMobile ? CONFIG.minScaleMobile : CONFIG.minScaleDesktop;
      const minTranslateZ = isMobile ? CONFIG.minTranslateZMobile : CONFIG.minTranslateZDesktop;
      const influenceDistance = itemSpacing * (isMobile ? CONFIG.influenceRangeMobile : CONFIG.influenceRangeDesktop);
      const cardBorderRadius = isMobile ? CONFIG.cardBorderRadiusMobile : CONFIG.cardBorderRadiusDesktop;

      layoutMetrics = {
        isMobile,
        cardWidth,
        cardHeight,
        cardGap,
        itemSpacing,
        totalTrackWidth,
        maxRotation,
        maxFanRoll,
        minScale,
        minTranslateZ,
        influenceDistance,
        cardBorderRadius,
      };

      stageEl.style.perspective = `${CONFIG.perspective}px`;

      cardElements.forEach((card) => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        card.style.marginLeft = `${-cardWidth / 2}px`;
        card.style.marginTop = `${-cardHeight / 2}px`;
        card.style.borderRadius = `${cardBorderRadius}px`;
      });
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    let animationFrameId: number;
    let lastFrameTime = performance.now();

    function renderLoop(currentTime: number) {
      const dt = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
      lastFrameTime = currentTime;

      const p = physicsRef.current;
      const {
        itemSpacing,
        totalTrackWidth,
        maxRotation,
        maxFanRoll,
        minScale,
        minTranslateZ,
        influenceDistance,
      } = layoutMetrics;

      // 1. Position update & velocity physics (Zero Auto-Scroll: purely gesture & momentum)
      if (p.isDragging) {
        // Direct pointer manipulation handled in onPointerMove
      } else if (p.isSnapping) {
        const snapDiff = p.targetSnapScrollX - p.scrollX;
        if (Math.abs(snapDiff) > 0.4) {
          p.scrollX += snapDiff * (1 - Math.exp(-CONFIG.snapSpring * dt * 60));
        } else {
          p.scrollX = p.targetSnapScrollX;
          p.isSnapping = false;
        }
      } else {
        // Momentum glide on release
        if (Math.abs(p.velocity) > 0.6) {
          p.scrollX += p.velocity * dt;
          p.velocity *= Math.pow(CONFIG.friction, dt * 60);

          // Once velocity decays below threshold, trigger smooth auto-snap to nearest card
          if (Math.abs(p.velocity) < CONFIG.snapTriggerVelocity && !p.isWheeling) {
            p.velocity = 0;
            const nearestCardIndex = Math.round(p.scrollX / itemSpacing);
            p.targetSnapScrollX = nearestCardIndex * itemSpacing;
            p.isSnapping = true;
          }
        } else {
          p.velocity = 0;
        }
      }

      // Wrap scrollX continuously for seamless infinite carousel
      p.scrollX = ((p.scrollX % totalTrackWidth) + totalTrackWidth) % totalTrackWidth;

      // 2. Compute 3D positions, dramatic tilt, lenticular parallax, scale, and lighting
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
        // Non-linear rotation curve: center card stays face-forward, flanks sharply tilt
        const rotCurve = Math.pow(Math.min(1.0, absDist / (itemSpacing * 1.35)), 0.85);
        const scaleCurve = Math.pow(norm, 1.15);
        const zCurve = Math.pow(norm, 1.12);
        const opacityCurve = Math.pow(norm, 1.4);

        const sign = dist >= 0 ? -1 : 1;
        const rotateY = sign * rotCurve * maxRotation;
        const rotateZ = -sign * rotCurve * maxFanRoll; // Subtle arching fan tilt
        const scale = CONFIG.centerScale - (CONFIG.centerScale - minScale) * scaleCurve;
        const translateZ = minTranslateZ * zCurve;
        const opacity = CONFIG.centerOpacity - (CONFIG.centerOpacity - CONFIG.minOpacity) * opacityCurve;
        const overlayOpacity = CONFIG.minBrightnessOverlay * norm;
        const zIndex = Math.max(1, Math.round(1000 - absDist));

        // 3D Card Transform
        card.style.transform = `translate3d(${dist.toFixed(2)}px, 0px, ${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = zIndex.toString();

        // Interesting Micro-interaction: Lenticular Inner Image Parallax Shift
        const innerImg = card.querySelector<HTMLElement>(".flow-card-img");
        if (innerImg) {
          const parallaxShiftX = -sign * rotCurve * CONFIG.lenticularParallaxShift;
          innerImg.style.transform = `scale(1.12) translate3d(${parallaxShiftX.toFixed(2)}px, 0px, 0px)`;
        }

        // Periphery lighting overlay
        const dimOverlay = card.querySelector<HTMLElement>(".card-dim-overlay");
        if (dimOverlay) {
          dimOverlay.style.opacity = overlayOpacity.toFixed(3);
        }

        // Active Center Card Label Badge
        const badge = card.querySelector<HTMLElement>(".card-center-badge");
        if (badge) {
          const badgeOpacity = Math.max(0, 1 - absDist / (itemSpacing * 0.7));
          badge.style.opacity = badgeOpacity.toFixed(3);
          badge.style.pointerEvents = badgeOpacity > 0.6 ? "auto" : "none";
          badge.style.transform = `translateY(${(1 - badgeOpacity) * 8}px)`;
        }
      });

      if (centerCandidateIdx !== activeCenterIndex) {
        setActiveCenterIndex(centerCandidateIdx);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    animationFrameId = requestAnimationFrame(renderLoop);

    // Pointer Drag Listeners (Touch & Mouse unified)
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
    };

    const onPointerUp = (e: PointerEvent) => {
      const p = physicsRef.current;
      if (!p.isDragging) return;
      p.isDragging = false;
      try {
        stageEl.releasePointerCapture(e.pointerId);
      } catch (err) {}
      p.velocity = Math.max(-1400, Math.min(1400, p.velocity));

      // If user released with almost no velocity, auto-snap to nearest immediately
      if (Math.abs(p.velocity) < CONFIG.snapTriggerVelocity) {
        const { itemSpacing } = layoutMetrics;
        const nearestCardIndex = Math.round(p.scrollX / itemSpacing);
        p.targetSnapScrollX = nearestCardIndex * itemSpacing;
        p.isSnapping = true;
        p.velocity = 0;
      }
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

        clearTimeout(p.wheelTimeout);
        p.wheelTimeout = setTimeout(() => {
          p.isWheeling = false;
          // Snap after wheel stops
          const { itemSpacing } = layoutMetrics;
          const nearestCardIndex = Math.round(p.scrollX / itemSpacing);
          p.targetSnapScrollX = nearestCardIndex * itemSpacing;
          p.isSnapping = true;
          p.velocity = 0;
        }, 150);
      }
    };

    stageEl.addEventListener("pointerdown", onPointerDown);
    stageEl.addEventListener("pointermove", onPointerMove);
    stageEl.addEventListener("pointerup", onPointerUp);
    stageEl.addEventListener("pointercancel", onPointerUp);
    stageEl.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(animationFrameId);
      stageEl.removeEventListener("pointerdown", onPointerDown);
      stageEl.removeEventListener("pointermove", onPointerMove);
      stageEl.removeEventListener("pointerup", onPointerUp);
      stageEl.removeEventListener("pointercancel", onPointerUp);
      stageEl.removeEventListener("wheel", onWheel);
    };
  }, [totalItems, activeCenterIndex]);

  // Click on card handler: center if outer; explore link if centered
  const handleCardClick = (index: number, link: string) => {
    if (Math.abs(physicsRef.current.velocity) > 25) return;
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 228 : 310;
    const cardGap = isMobile ? 24 : 36;
    const itemSpacing = cardWidth + cardGap;
    const totalTrackWidth = totalItems * itemSpacing;

    let dist = (index * itemSpacing - physicsRef.current.scrollX) % totalTrackWidth;
    if (dist > totalTrackWidth / 2) dist -= totalTrackWidth;
    if (dist < -totalTrackWidth / 2) dist += totalTrackWidth;

    if (Math.abs(dist) < 18) {
      // Centered card clicked: explore drape
      navigate(link);
    } else {
      // Flanking card clicked: snap to center
      snapToCardIndex(index);
    }
  };

  const rawActiveIdx = activeCenterIndex % (items.length || 1);
  const currentItem = items[rawActiveIdx] || items[0];

  return (
    <div className="relative w-full overflow-hidden select-none py-1 sm:py-2">
      {/* 3D Perspective Stage Container */}
      <div
        ref={stageRef}
        className="carousel-perspective-stage relative w-full h-[360px] sm:h-[430px] lg:h-[460px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing touch-pan-y"
      >
        {/* Soft Vignette Fades on edges */}
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
              {/* Saree Drape Image with Lenticular Counter-Parallax */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <img
                  src={item.image}
                  alt={item.title}
                  className="flow-card-img absolute inset-0 w-full h-full object-cover transition-transform duration-75 will-change-transform"
                  loading={idx < 6 ? "eager" : "lazy"}
                  // @ts-ignore - React 18 / DOM fetchPriority support
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  decoding={idx < 3 ? "sync" : "async"}
                  draggable={false}
                />
              </div>

              {/* Luxury Silk/Glass Sheen */}
              <div className="absolute inset-0 flow-card-sheen pointer-events-none" />

              {/* Periphery Depth Dim Overlay */}
              <div
                className="card-dim-overlay absolute inset-0 bg-[#2A1235] pointer-events-none transition-opacity duration-75"
                style={{ opacity: 0 }}
              />

              {/* Active Center Card Floating Badge */}
              <div
                className="card-center-badge relative z-10 p-3.5 sm:p-4 rounded-[20px] bg-brand-ivory/95 backdrop-blur-md border border-white/60 text-brand-deepPlum shadow-md transition-all duration-150"
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
          <div className="px-3.5 py-1 rounded-full bg-brand-ivory/90 backdrop-blur-xs border border-brand-lilac/35 text-[10px] tracking-wider uppercase text-brand-deepPlum/70 flex items-center gap-2 shadow-2xs">
            <span>← Swipe or Drag to Rotate Saree Gallery →</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Active Item Metadata Bar */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-1 border-t border-brand-lilac/25">
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

        {/* Arrow Navigation & Direct Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Previous Card Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous saree"
            className="w-10 h-10 rounded-full bg-white hover:bg-brand-ivory border border-brand-lilac/50 flex items-center justify-center text-brand-deepPlum transition-all shadow-xs hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Card Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next saree"
            className="w-10 h-10 rounded-full bg-white hover:bg-brand-ivory border border-brand-lilac/50 flex items-center justify-center text-brand-deepPlum transition-all shadow-xs hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Direct Drape Explore Link */}
          {currentItem && (
            <Link
              to={currentItem.link}
              className="ml-2 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-deepPlum text-white hover:bg-brand-plum transition-all shadow-xs"
            >
              Explore Drape ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
