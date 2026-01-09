"use client";

import { useEffect, useRef, useState } from "react";

const aiMagicTabs = [
  {
    id: "twilight",
    label: "Twilight",
    before:
      "https://www.fotello.co/attached_assets/optimized/twilight%202%20-%20before_1758203006775.webp",
    after:
      "https://www.fotello.co/attached_assets/optimized/twilight%202%20-%20after_1758203006775.webp",
  },
  {
    id: "window-pull",
    label: "Window Pull",
    before:
      "https://www.fotello.co/attached_assets/optimized/window-pull-before.webp",
    after:
      "https://www.fotello.co/attached_assets/optimized/window-pull-after.webp",
  },
  {
    id: "sky-replacement",
    label: "Sky Replacement",
    before: "https://www.fotello.co/attached_assets/optimized/sky-before.webp",
    after: "https://www.fotello.co/attached_assets/optimized/sky-after.webp",
  },
  {
    id: "water-enhancement",
    label: "Water Enhancement",
    before:
      "https://www.fotello.co/attached_assets/optimized/water%20-%20before_1758203006775.webp",
    after:
      "https://www.fotello.co/attached_assets/optimized/water%20-%20after_1758203006775.webp",
  },
  {
    id: "camera-removal",
    label: "Camera Removal",
    before:
      "https://www.fotello.co/attached_assets/optimized/Camera%20before_1758288924762.jpg",
    after:
      "https://www.fotello.co/attached_assets/optimized/Camera%20after_1758288924762.jpg",
  },
  {
    id: "hand-removal",
    label: "Hand Removal",
    before: "https://www.fotello.co/attached_assets/optimized/hand-before.webp",
    after: "https://www.fotello.co/attached_assets/optimized/hand-after.webp",
  },
  {
    id: "lens-correction",
    label: "Lens Correction",
    before: "https://www.fotello.co/attached_assets/optimized/lens-before.webp",
    after: "https://www.fotello.co/attached_assets/optimized/lens-after.webp",
  },
  {
    id: "white-balancing",
    label: "White Balancing",
    before: "https://www.fotello.co/attached_assets/optimized/wb-before.webp",
    after: "https://www.fotello.co/attached_assets/optimized/wb-after.webp",
  },
];

function ComparisonSlider({
  beforeSrc,
  afterSrc,
}: {
  beforeSrc: string;
  afterSrc: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div
      className="relative aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-2xl"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      ref={containerRef}
      style={{
        backgroundColor: "var(--landing-card)",
        border: "1px solid var(--landing-border)",
      }}
    >
      {/* After Image (Background) */}
      <img
        alt="After"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        src={afterSrc}
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          alt="Before"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          src={beforeSrc}
          style={{ width: containerRef.current?.offsetWidth }}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 z-10 w-1"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }}
      >
        {/* Handle Circle */}
        <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
          <svg
            className="size-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span
        className="absolute top-4 left-4 rounded-full px-3 py-1 font-medium text-xs"
        style={{
          backgroundColor: "var(--landing-bg-alt)",
          color: "var(--landing-text-muted)",
          border: "1px solid var(--landing-border)",
        }}
      >
        Before
      </span>
      <span
        className="absolute top-4 right-4 rounded-full px-3 py-1 font-medium text-xs"
        style={{
          backgroundColor: "var(--landing-accent)",
          color: "var(--landing-accent-foreground)",
        }}
      >
        After
      </span>
    </div>
  );
}

export function LandingAiMagic() {
  const [activeTab, setActiveTab] = useState(0);
  const activeFeature = aiMagicTabs[activeTab];

  return (
    <section
      className="px-6 py-24 md:py-32"
      id="one-click-ai-magic"
      style={{ backgroundColor: "var(--landing-bg-alt)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="font-semibold text-sm uppercase tracking-wider"
            style={{ color: "var(--landing-accent)" }}
          >
            AI Enhancements
          </p>
          <h2
            className="mt-3 font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl"
            style={{ color: "var(--landing-text)" }}
          >
            One-Click AI Magic
            <br />
            for Every Shot
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--landing-text-muted)" }}
          >
            Professional edits in seconds. Drag the slider to see the
            transformation.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {aiMagicTabs.map((tab, index) => (
            <button
              className={`rounded-full px-4 py-2 font-medium text-sm transition-all duration-200 ${
                activeTab === index
                  ? "scale-105"
                  : "opacity-70 hover:scale-[1.02] hover:opacity-100"
              }`}
              key={tab.id}
              onClick={() => setActiveTab(index)}
              style={{
                backgroundColor:
                  activeTab === index
                    ? "var(--landing-accent)"
                    : "var(--landing-card)",
                color:
                  activeTab === index
                    ? "var(--landing-accent-foreground)"
                    : "var(--landing-text)",
                border:
                  activeTab === index
                    ? "none"
                    : "1px solid var(--landing-border)",
              }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Comparison Slider */}
        <div className="mx-auto mt-10 max-w-4xl">
          <ComparisonSlider
            afterSrc={activeFeature.after}
            beforeSrc={activeFeature.before}
            key={activeFeature.id}
          />
        </div>

        {/* Hint */}
        <p
          className="mt-6 text-center text-sm"
          style={{ color: "var(--landing-text-muted)" }}
        >
          Drag the slider to compare before and after
        </p>
      </div>
    </section>
  );
}
