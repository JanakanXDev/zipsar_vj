import { create } from "zustand";

export type QualityTier = "high" | "mid" | "low";

/**
 * The experience store — the single sync point between the scroll/GSAP
 * world, the pointer, and the WebGL canvas (Blueprint §6.3). GSAP and
 * Lenis WRITE here once per tick; the canvas READS via getState() once
 * per frame (no React re-render in the hot path).
 */
export interface ExperienceState {
  /** Whole-page scroll progress 0..1 — written by SmoothScrollProvider. */
  scrollProgress: number;
  /** Scroll velocity from Lenis — drives motion intensity. */
  scrollVelocity: number;
  /** Anchor id of the currently active act/section. */
  activeSection: string | null;
  /** Per-section local progress 0..1, keyed by section id. */
  sectionProgress: Record<string, number>;
  /** Normalized pointer position −1..1 (cursor interaction system). */
  pointerX: number;
  pointerY: number;
  /** GPU quality tier (§5.5). */
  qualityTier: QualityTier;
  /** False after an unrecoverable WebGL context loss (§5.1). */
  webglOk: boolean;

  setScroll: (progress: number, velocity: number) => void;
  setActiveSection: (id: string | null) => void;
  setSectionProgress: (id: string, progress: number) => void;
  setPointer: (x: number, y: number) => void;
  setQualityTier: (tier: QualityTier) => void;
  setWebglOk: (ok: boolean) => void;
}

export const useExperienceStore = create<ExperienceState>()((set) => ({
  scrollProgress: 0,
  scrollVelocity: 0,
  activeSection: null,
  sectionProgress: {},
  pointerX: 0,
  pointerY: 0,
  qualityTier: "mid",
  webglOk: true,

  setScroll: (scrollProgress, scrollVelocity) => set({ scrollProgress, scrollVelocity }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setSectionProgress: (id, progress) =>
    set((state) => ({ sectionProgress: { ...state.sectionProgress, [id]: progress } })),
  setPointer: (pointerX, pointerY) => set({ pointerX, pointerY }),
  setQualityTier: (qualityTier) => set({ qualityTier }),
  setWebglOk: (webglOk) => set({ webglOk }),
}));
