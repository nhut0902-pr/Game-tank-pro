/**
 * Math Utilities
 * Các hàm toán học tiện ích
 */

import * as THREE from 'three';

/**
 * Chuẩn hóa góc về range [-PI, PI]
 */
export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

/**
 * Damping angle - làm mượt góc
 */
export function dampAngle(current, target, speed, dt) {
  const diff = normalizeAngle(target - current);
  return current + diff * (1 - Math.exp(-speed * dt));
}

/**
 * Lerp giữa hai góc
 */
export function lerpAngle(a, b, t) {
  const diff = normalizeAngle(b - a);
  return a + diff * t;
}

/**
 * Distance 2D
 */
export function distance2D(x1, z1, x2, z2) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Check if point is in circle
 */
export function isPointInCircle(px, pz, cx, cz, radius) {
  return distance2D(px, pz, cx, cz) <= radius;
}

/**
 * Clamp value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Lerp
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Random in range
 */
export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Random integer
 */
export function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/**
 * Vector angle
 */
export function vectorAngle(x, z) {
  return Math.atan2(x, z);
}

/**
 * Rotate vector
 */
export function rotateVector(x, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - z * sin,
    z: x * sin + z * cos,
  };
}

/**
 * Perlin-like noise (simplified)
 */
export function perlinNoise(x, y, seed = 0) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Smooth step
 */
export function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

/**
 * Smootherstep
 */
export function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
