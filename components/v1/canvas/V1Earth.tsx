"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experienceStore";

/**
 * The Earth — V1.0 hero "character" (photoreal day/night). Custom shader
 * blends the NASA-style day map and city-night-lights map across the
 * terminator, adds an ocean sun-glint and a subtle blue atmosphere rim;
 * a separate cloud shell and a back-side fresnel atmosphere complete it.
 *
 * Textures load defensively from /assets/earth — if any required map is
 * missing, a tasteful procedural fallback Earth renders instead, so the
 * build/runtime never breaks. Time-based intro fade ("Earth emerges").
 */

const SUN = new THREE.Vector3(-0.6, 0.32, 0.8).normalize();
const RADIUS = 3.2;
const BASE_Y = -3.5;
const TILT_X = -0.08;

const EARTH_VERT = `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorld;
void main() {
  vUv = uv;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const EARTH_FRAG = `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uSpec;
uniform vec3 uSun;
uniform float uOpacity;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vWorld;
void main() {
  vec3 n = normalize(vNormalW);
  vec3 s = normalize(uSun);
  float d = dot(n, s);
  float dayMix = smoothstep(-0.15, 0.25, d);
  vec3 day = texture2D(uDay, vUv).rgb;
  vec3 night = texture2D(uNight, vUv).rgb;
  vec3 col = mix(night * 1.35, day, dayMix);
  vec3 viewDir = normalize(cameraPosition - vWorld);
  float ocean = texture2D(uSpec, vUv).r;
  vec3 h = normalize(s + viewDir);
  float spec = pow(max(dot(n, h), 0.0), 28.0) * ocean * dayMix;
  col += vec3(0.65, 0.78, 1.0) * spec * 0.5;
  float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
  col += vec3(0.31, 0.62, 1.0) * fres * (0.3 + 0.45 * dayMix);
  gl_FragColor = vec4(col, uOpacity);
}`;

const ATMO_VERT = `
varying vec3 vNormalW;
varying vec3 vWorld;
void main() {
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const ATMO_FRAG = `
uniform float uOpacity;
varying vec3 vNormalW;
varying vec3 vWorld;
void main() {
  vec3 v = normalize(cameraPosition - vWorld);
  float i = pow(clamp(0.72 - dot(vNormalW, v), 0.0, 1.0), 3.0);
  gl_FragColor = vec4(vec3(0.31, 0.62, 1.0) * i * uOpacity, i * uOpacity);
}`;

export function V1Earth() {
  const groupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const fallbackMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const texturesRef = useRef<THREE.Texture[]>([]);

  const [ready, setReady] = useState(false);
  const [clouds, setClouds] = useState<THREE.Texture | null>(null);

  const earthUniforms = useMemo(
    () => ({
      uDay: { value: null as THREE.Texture | null },
      uNight: { value: null as THREE.Texture | null },
      uSpec: { value: null as THREE.Texture | null },
      uSun: { value: SUN.clone() },
      uOpacity: { value: 0 },
    }),
    [],
  );
  const atmoUniforms = useMemo(() => ({ uOpacity: { value: 0 } }), []);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const load = (file: string) =>
      new Promise<THREE.Texture>((resolve, reject) =>
        loader.load(`/assets/earth/${file}`, resolve, undefined, reject),
      );

    let alive = true;
    Promise.all([load("diffuse.jpg"), load("night.jpg"), load("specular.jpg"), load("clouds.jpg")])
      .then(([day, night, spec, cloudTex]) => {
        if (!alive) return;
        day.colorSpace = THREE.SRGBColorSpace;
        night.colorSpace = THREE.SRGBColorSpace;
        for (const t of [day, night, spec, cloudTex]) t.anisotropy = 4;
        earthUniforms.uDay.value = day;
        earthUniforms.uNight.value = night;
        earthUniforms.uSpec.value = spec;
        texturesRef.current = [day, night, spec, cloudTex];
        setClouds(cloudTex);
        setReady(true);
      })
      .catch(() => alive && setReady(false));

    return () => {
      alive = false;
      texturesRef.current.forEach((t) => t.dispose());
      texturesRef.current = [];
    };
  }, [earthUniforms]);

  useFrame((state, delta) => {
    const o = THREE.MathUtils.clamp((state.clock.elapsedTime - 1) / 3, 0, 1);

    if (earthMeshRef.current) earthMeshRef.current.rotation.y += delta * 0.012;
    if (cloudsMeshRef.current) cloudsMeshRef.current.rotation.y += delta * 0.016;

    if (ready) earthUniforms.uOpacity.value = o;
    else if (fallbackMatRef.current) fallbackMatRef.current.opacity = o;
    if (cloudsMatRef.current) cloudsMatRef.current.opacity = 0.32 * o;
    atmoUniforms.uOpacity.value = o * 0.9;

    const group = groupRef.current;
    if (group) {
      const store = useExperienceStore.getState();
      group.position.y = BASE_Y + store.scrollProgress * 0.3;
      group.rotation.x = THREE.MathUtils.damp(
        group.rotation.x,
        TILT_X + store.pointerY * 0.05,
        3,
        delta,
      );
      group.rotation.z = 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, BASE_Y, 0]}>
      {ready ? (
        <mesh ref={earthMeshRef}>
          <sphereGeometry args={[RADIUS, 96, 96]} />
          <shaderMaterial
            vertexShader={EARTH_VERT}
            fragmentShader={EARTH_FRAG}
            uniforms={earthUniforms}
            transparent
          />
        </mesh>
      ) : (
        <mesh ref={earthMeshRef}>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <meshStandardMaterial
            ref={fallbackMatRef}
            color="#0b2545"
            emissive="#0a1830"
            emissiveIntensity={0.5}
            roughness={0.9}
            metalness={0.1}
            transparent
            opacity={0}
          />
        </mesh>
      )}

      {clouds && (
        <mesh ref={cloudsMeshRef} scale={1.012}>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <meshStandardMaterial
            ref={cloudsMatRef}
            color="#ffffff"
            alphaMap={clouds}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh scale={1.06}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <shaderMaterial
          vertexShader={ATMO_VERT}
          fragmentShader={ATMO_FRAG}
          uniforms={atmoUniforms}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
