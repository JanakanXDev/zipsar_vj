"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

/**
 * Placeholder story props for the Prologue camera journey
 * (Space → Earth → Cities → Dreamers). PLACEHOLDER ASSETS by design —
 * to be replaced with production glTF models (Blueprint §5.4) without
 * touching the camera path.
 */

const prepareModel = (scene: THREE.Group) => {
  let meshCount = 0;
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    meshCount++;
    child.castShadow = false;
    child.receiveShadow = false;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      
      // Ensure sRGB color space for textures
      if (material.map) (material.map as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
      if (material.emissiveMap) (material.emissiveMap as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
      
      // Set double-sided rendering
      material.side = THREE.DoubleSide;
      
      // Ensure material is visible - set a default color if it's completely dark
      if ((material as THREE.MeshStandardMaterial).color) {
        const mat = material as THREE.MeshStandardMaterial;
        // Only set color if it's black (0x000000)
        if (mat.color.getHex() === 0x000000 && !mat.map) {
          mat.color.set(0xcccccc); // light gray fallback
          console.log("🏙️ Applied fallback color to dark material");
        }
      }
      
      material.needsUpdate = true;
    });
  });
  console.log(`🏙️ prepareModel processed ${meshCount} meshes`);
};


/* ── Earth (z −18): exact Earth GLB asset with textures ── */
function EarthPlaceholder() {
  // useGLTF automatically caches and supports Draco compression
  const { scene: rawScene } = useGLTF("/models/hello_world.glb");
  const ref = useRef<THREE.Group>(null);

  const earthScene = useMemo(() => {
    const scene = rawScene.clone(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    const size = box.getSize(new THREE.Vector3());
    const maxExtent = Math.max(size.x, size.y, size.z) || 1;
    const scale = 6.0 / maxExtent;
    scene.scale.setScalar(scale);

    prepareModel(scene);
    return scene;
  }, [rawScene]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.05;
    
    // Performance: Manual LOD / Distance Culling
    const distance = Math.abs(state.camera.position.z - ref.current.position.z);
    ref.current.visible = distance < 30; // Only render when within 30 units
  });

  return (
    <group ref={ref} position={[0, -0.4, -18]}>
      {/* Heavy lights removed: relies on global Scene.tsx lighting */}
      <primitive object={earthScene} dispose={null} />
    </group>
  );
}

/* ── Cities (z −38): exact city GLB asset with textures ── */
function CityPlaceholder() {
  const { scene: rawScene } = useGLTF("/models/city/san_francisco_city-converted.glb");
  const ref = useRef<THREE.Group>(null);

  const cityScene = useMemo(() => {
    const scene = rawScene.clone(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    const size = box.getSize(new THREE.Vector3());
    const scale = Math.min(0.0065, 10 / Math.max(size.x, size.z, 1));
    scene.scale.setScalar(scale);

    const scaledBox = new THREE.Box3().setFromObject(scene);
    scene.position.y -= scaledBox.min.y;

    prepareModel(scene);
    return scene;
  }, [rawScene]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, 0.35, 2.0, delta);
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, 0, 4.0, delta);
    
    // Performance: Manual LOD / Distance Culling
    const distance = Math.abs(state.camera.position.z - ref.current.position.z);
    ref.current.visible = distance < 35; // Only render when within 35 units
  });

  return (
    <group ref={ref} position={[0, 0, -38]} rotation={[0, 0.4, 0]}>
      {/* Heavy lights removed: relies on global Scene.tsx lighting */}
      <primitive object={cityScene} dispose={null} />
    </group>
  );
}

/* ── Dreamer (z −56): luminous abstract presence — wireframe + core ── */
function DreamerPlaceholder() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) return;
    group.rotation.y += delta * 0.25;
    group.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
    
    // Performance: Manual LOD / Distance Culling
    const distance = Math.abs(state.camera.position.z - group.position.z);
    group.visible = distance < 30;
  });
  
  return (
    <group ref={ref} position={[0, 0.3, -56]}>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshBasicMaterial
          color="#34d399"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Point light retained here because it's essential to the glowing core effect */}
      <pointLight color="#a78bfa" intensity={6} distance={14} decay={2} />
    </group>
  );
}

export function StoryProps() {
  return (
    <>
      <EarthPlaceholder />
      <CityPlaceholder />
      <DreamerPlaceholder />
    </>
  );
}

// Preload models
useGLTF.preload("/models/hello_world.glb");
useGLTF.preload("/models/city/san_francisco_city-converted.glb");
