"use client";

import { useEffect, useRef } from "react";
import { createProgram, createFullscreenQuad, dpr } from "./glUtils";

// Soft mesh gradient: a handful of colored blobs softly blended via inverse-
// distance weighting. Blobs drift on noise. Cursor acts as an extra blob;
// clicks gently shove existing blobs outward from the click point.

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;

  uniform vec2  u_res;
  uniform vec4  u_blobs[6];   // (x, y, weight, padding)
  uniform vec3  u_colors[6];  // matching color per blob
  uniform vec3  u_cursor;     // (x, y, weight) — extra blob from pointer
  uniform vec3  u_cursorCol;
  uniform float u_time;

  void main() {
    float minDim = min(u_res.x, u_res.y);
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / minDim;

    // Inverse-distance weighted color blend
    vec3 acc = vec3(0.0);
    float wsum = 0.0;
    for (int i = 0; i < 6; i++) {
      vec4 b = u_blobs[i];
      if (b.z <= 0.0) continue;
      vec2 d = uv - b.xy;
      float w = b.z / (dot(d, d) + 0.025);
      acc += u_colors[i] * w;
      wsum += w;
    }
    // Cursor blob
    {
      vec2 d = uv - u_cursor.xy;
      float w = u_cursor.z / (dot(d, d) + 0.04);
      acc += u_cursorCol * w;
      wsum += w;
    }
    vec3 col = acc / max(wsum, 0.0001);

    // Slow time-based hue shimmer for life — tiny rotation in RG space
    float s = sin(u_time * 0.4) * 0.04;
    col.rg = vec2(col.r * cos(s) - col.g * sin(s),
                  col.r * sin(s) + col.g * cos(s));

    // Soft film-grain via cheap hash
    float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (n - 0.5) * 0.015;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Brand-aligned palette (navy, gold, cream, plus muted complements)
const PALETTE: [number, number, number][] = [
  [0.118, 0.357, 0.659], // navy
  [0.957, 0.769, 0.188], // gold
  [0.98, 0.97, 0.94],    // cream
  [0.62, 0.42, 0.72],    // soft violet
  [0.93, 0.55, 0.40],    // soft coral
  [0.38, 0.68, 0.75],    // soft teal
];

type Blob = {
  baseX: number;
  baseY: number;
  phaseX: number;
  phaseY: number;
  weight: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

export default function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false }) as WebGLRenderingContext | null;
    if (!gl) return;
    const prog = createProgram(gl, VERT, FRAG);
    if (!prog) return;
    const quad = createFullscreenQuad(gl);
    if (!quad) return;

    const posLoc = gl.getAttribLocation(prog, "a_pos");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uBlobs = gl.getUniformLocation(prog, "u_blobs");
    const uColors = gl.getUniformLocation(prog, "u_colors");
    const uCursor = gl.getUniformLocation(prog, "u_cursor");
    const uCursorCol = gl.getUniformLocation(prog, "u_cursorCol");
    const uTime = gl.getUniformLocation(prog, "u_time");

    // Initial blob layout — roughly spaced around the viewport
    const blobs: Blob[] = [
      { baseX: -0.55, baseY:  0.35, phaseX: 0.0, phaseY: 1.7, weight: 0.50, vx: 0, vy: 0, x: -0.55, y:  0.35 },
      { baseX:  0.55, baseY:  0.30, phaseX: 1.1, phaseY: 0.4, weight: 0.55, vx: 0, vy: 0, x:  0.55, y:  0.30 },
      { baseX: -0.35, baseY: -0.40, phaseX: 2.0, phaseY: 2.3, weight: 0.45, vx: 0, vy: 0, x: -0.35, y: -0.40 },
      { baseX:  0.40, baseY: -0.35, phaseX: 3.2, phaseY: 1.0, weight: 0.50, vx: 0, vy: 0, x:  0.40, y: -0.35 },
      { baseX:  0.00, baseY:  0.05, phaseX: 0.6, phaseY: 3.1, weight: 0.40, vx: 0, vy: 0, x:  0.00, y:  0.05 },
      { baseX: -0.05, baseY: -0.10, phaseX: 4.4, phaseY: 0.8, weight: 0.35, vx: 0, vy: 0, x: -0.05, y: -0.10 },
    ];

    const blobBuf = new Float32Array(6 * 4);
    const colorBuf = new Float32Array(6 * 3);
    for (let i = 0; i < 6; i++) {
      colorBuf[i * 3 + 0] = PALETTE[i][0];
      colorBuf[i * 3 + 1] = PALETTE[i][1];
      colorBuf[i * 3 + 2] = PALETTE[i][2];
    }

    const cursor = { x: 0, y: 0, hasMoved: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr()));
      const h = Math.max(1, Math.floor(rect.height * dpr()));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const toShaderUV = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect();
      const d = dpr();
      const px = (cx - rect.left) * d;
      const py = (rect.height - (cy - rect.top)) * d;
      const minDim = Math.min(canvas.width, canvas.height);
      return { x: (px - 0.5 * canvas.width) / minDim, y: (py - 0.5 * canvas.height) / minDim };
    };

    const onMove = (e: PointerEvent) => {
      const p = toShaderUV(e.clientX, e.clientY);
      cursor.x = p.x;
      cursor.y = p.y;
      cursor.hasMoved = true;
    };
    const onDown = (e: PointerEvent) => {
      const p = toShaderUV(e.clientX, e.clientY);
      // Shove every blob away from the click point
      for (const b of blobs) {
        const dx = b.x - p.x;
        const dy = b.y - p.y;
        const dist = Math.hypot(dx, dy) + 0.001;
        const push = 0.6 / (dist * dist + 0.5);
        b.vx += (dx / dist) * push;
        b.vy += (dy / dist) * push;
      }
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);

    const t0 = performance.now();
    let last = t0;
    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      const now = performance.now();
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Integrate blob motion: noise-driven drift toward base + impulse decay
      for (const b of blobs) {
        const targetX = b.baseX + 0.18 * Math.sin(t * 0.45 + b.phaseX);
        const targetY = b.baseY + 0.18 * Math.cos(t * 0.5 + b.phaseY);
        // Spring toward target
        const kSpring = 1.6;
        const kDamp = 1.8;
        b.vx += (targetX - b.x) * kSpring * dt;
        b.vy += (targetY - b.y) * kSpring * dt;
        b.vx *= Math.exp(-kDamp * dt);
        b.vy *= Math.exp(-kDamp * dt);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }

      for (let i = 0; i < 6; i++) {
        blobBuf[i * 4 + 0] = blobs[i].x;
        blobBuf[i * 4 + 1] = blobs[i].y;
        blobBuf[i * 4 + 2] = blobs[i].weight;
        blobBuf[i * 4 + 3] = 0;
      }

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform4fv(uBlobs, blobBuf);
      gl.uniform3fv(uColors, colorBuf);
      // Cursor blob: gold tint, only active once pointer has moved
      gl.uniform3f(uCursor, cursor.x, cursor.y, cursor.hasMoved ? 0.45 : 0.0);
      gl.uniform3f(uCursorCol, 0.957, 0.769, 0.188);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      gl.deleteProgram(prog);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
      aria-hidden
    />
  );
}
