"use client";

import { useEffect } from "react";
import { getGPUTier } from "detect-gpu";
import { useExperienceStore, type QualityTier } from "@/stores/experienceStore";

let detectionStarted = false;

/**
 * GPU quality tier detection (Blueprint §5.5) — runs once per session,
 * writes the result to the experience store. Defaults to "mid" until
 * (or unless) detection resolves; any failure stays "mid".
 */
export function useQualityTier(): QualityTier {
  const tier = useExperienceStore((state) => state.qualityTier);

  useEffect(() => {
    if (detectionStarted) return;
    detectionStarted = true;

    let mounted = true;
    getGPUTier()
      .then((result) => {
        if (!mounted) return;
        const resolved: QualityTier = result.tier >= 3 ? "high" : result.tier === 2 ? "mid" : "low";
        useExperienceStore.getState().setQualityTier(resolved);
      })
      .catch(() => {
        /* stay at "mid" */
      });
    return () => {
      mounted = false;
    };
  }, []);

  return tier;
}
