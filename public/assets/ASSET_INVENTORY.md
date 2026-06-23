# 🎬 Zipsar V1.0 — Asset Inventory

> Tracks every real-imagery asset the cinematic V1 experience requires.
> Per FINAL CREATIVE DIRECTION v1.0: realistic only — NASA textures, real
> photography. No AI-fantasy, cyberpunk, neon, holograms, or low-poly.
>
> **Status legend:** ⛳ placeholder in use · ✅ real asset in place
>
> Components consume these paths now; dropping the real files at the same
> path swaps them in with no code change. Until then, fallbacks render.

## 🌍 Earth (Hero §1 + Finale §8) — NASA Blue Marble

| Filename | Resolution | Purpose | Placement | Fallback | Status |
|---|---|---|---|---|---|
| `earth/diffuse.jpg` | 2K (upgrade to 4K+ later) | Day color map | Hero + Finale sphere | Procedural blue material | ✅ |
| `earth/night.jpg` | 2K | City night lights (dark-side blend) | Hero + Finale sphere | none | ✅ |
| `earth/clouds.jpg` | 2K | Cloud layer (alphaMap, opacity ≈ 0.32) | Slightly larger sphere | none | ✅ |
| `earth/specular.jpg` | 2K | Ocean specular mask (sun glint) | Hero + Finale sphere | no glint | ✅ |
| `earth/normal.jpg` | ≥ 2K | Terrain relief (normalMap) | Hero + Finale sphere | flat (omitted) | ⛳ |

**Sources & licenses:**
- `diffuse / night / clouds` — Solar System Scope (https://www.solarsystemscope.com/textures/), **CC BY 4.0** (attribution required in site credits/footer).
- `specular` — three.js examples `textures/planets/earth_specular_2048.jpg`, **MIT**.
- `normal` — not yet sourced (SSS serves it as `.tif`); flat fallback in use. Upgrade target: NASA Blue Marble + topography-derived normal, 4K+.

> ⚠️ Add a CC BY 4.0 attribution for Solar System Scope to the site credits before production.

## 🏙 Imagery (license-free, premium, dark mood)

| Filename | Resolution | Purpose | Placement | Fallback | Status |
|---|---|---|---|---|---|
| `images/city.webp` | 2400×1350 | Night business-district skyline (Singapore/Dubai/London/NYC vibe) | optional ambient §1 context | solid ink + hairline frame | ⛳ |
| `images/workspace.webp` | 2400×1350 | Real founders/designers/devs collaborating (no posed stock smiles) | optional §3/§4 context | solid ink + hairline frame | ⛳ |
| `images/innovation-lab.webp` | 2400×1350 | Premium R&D / engineering / prototyping | §6 Future — the ONE cinematic image | solid ink + hairline frame | ⛳ |

**Source:** Unsplash / Pexels (free commercial use) — attribution captured here when downloaded.

## Implementation notes

- Store locally under `public/assets/**` (committed, served from the edge, immutable-cached).
- Earth textures load via Three.js `TextureLoader` with `KTX2`/compressed variants where possible; clamp anisotropy; dispose on unmount.
- Photography served via `next/image` with responsive `sizes`, `priority` only on the §6 hero image.
- Optimize for Lighthouse: WebP/AVIF, explicit dimensions (no CLS), lazy by default.
- **Automatic sourcing not yet performed** — all assets currently render via their fallbacks. Update `Status` to ✅ as real files land.
