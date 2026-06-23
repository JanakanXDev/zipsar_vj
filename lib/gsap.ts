/**
 * Central GSAP registration — the ONLY place plugins are registered
 * (Blueprint §6.1). Everything animation-related imports gsap (and
 * plugins) from here, never from "gsap" directly, so the plugin set
 * stays auditable.
 *
 * Registered: ScrollTrigger, SplitText, CustomEase.
 * Registered when needed later: DrawSVGPlugin, MotionPathPlugin, Flip.
 *
 * Named eases mirror styles/tokens.css §4.2 — keep both in sync:
 *   zip-drift  → --ease-drift   (default: camera, reveals)
 *   zip-arrive → --ease-arrive  (entering elements)
 *   zip-exit   → --ease-exit    (leaving elements)
 *   zip-pulse  → --ease-pulse   (glow breathing)
 */
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);

  CustomEase.create("zip-drift", "0.22, 1, 0.36, 1");
  CustomEase.create("zip-arrive", "0.16, 1, 0.3, 1");
  CustomEase.create("zip-exit", "0.7, 0, 0.84, 0");
  CustomEase.create("zip-pulse", "0.37, 0, 0.63, 1");

  /* Mobile address-bar show/hide fires resize events; refreshing
     ScrollTrigger on them causes pin jumps (Blueprint §12). */
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };
