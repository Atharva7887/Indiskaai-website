"use client";

import { useEffect, useRef } from "react";
import { createProgram, createFullscreenQuad, dpr } from "./glUtils";

// Interstellar-style grid warped by gravitational wells. Mouse is one well;
// clicks drop permanent wells (FIFO, up to 6).

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_time;
  uniform vec4  u_wells[7]; // (x, y, mass, age). first is the cursor (mass>0), rest are clicks

  void main() {
    float minDim = min(u_res.x, u_res.y);
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / minDim;

    // Warp uv by gravitational pull from each well
    vec2 warped = uv;
    for (int i = 0; i < 7; i++) {
      vec4 w = u_wells[i];
      if (w.z <= 0.0) continue;
      vec2 wp = w.xy;
      vec2 d = warped - wp;
      float r = length(d) + 0.04;
      // Pull strength falls off ~1/r; cap to avoid singularity
      warped -= normalize(d) * (w.z * 0.07) / r;
    }

    // Render grid lines in warped space
    float gridScale = 14.0;
    vec2 g = warped * gridScale;
    vec2 gridDist = abs(fract(g - 0.5) - 0.5);
    float line = min(gridDist.x, gridDist.y);
    // Width compensates for derivative of warped uv (anti-aliased)
    float w_aa = fwidth(line) * 0.9;
    float gridA = 1.0 - smoothstep(0.0, w_aa, line);

    // Color: cream lines on ink background; tint toward gold near wells, navy far
    vec3 bg = vec3(0.06, 0.06, 0.08);
    vec3 lineCol = vec3(0.96, 0.94, 0.86);

    // Distance to nearest well (in warped space) — colors the lines
    float minR = 99.0;
    for (int i = 0; i < 7; i++) {
      vec4 w = u_wells[i];
      if (w.z <= 0.0) continue;
      float r = length(uv - w.xy);
      minR = min(minR, r);
    }
    vec3 gold = vec3(0.957, 0.769, 0.188);
    vec3 navy = vec3(0.118, 0.357, 0.659);
    float prox = exp(-minR * 3.0);
    lineCol = mix(mix(lineCol, navy, 0.25), gold, prox);

    vec3 col = mix(bg, lineCol, gridA);

    // Glow each well as a soft dot
    for (int i = 0; i < 7; i++) {
      vec4 w = u_wells[i];
      if (w.z <= 0.0) continue;
      float r = length(uv - w.xy);
      float glow = exp(-r * 12.0) * w.z;
      col += gold * glow * 1.4;
    }

    // Subtle time-based shimmer along grid lines
    col += gridA * 0.05 * sin(u_time * 1.5 + (g.x + g.y) * 0.6);

    gl_FragColor = vec4(col, 1.0);
  }
`;

type Well = { x: number; y: number; mass: number; t0: number };

export default function GravityGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // WebGL1 is fine — no float textures needed
    const gl = canvas.getContext("webgl", { antialias: true, alpha: false }) as WebGLRenderingContext | null;
    if (!gl) return;

    // Enable standard derivatives (for fwidth)
    gl.getExtension("OES_standard_derivatives");
    // Inject derivative extension directive into fragment shader (WebGL1 quirk)
    const fragWithExt = "#extension GL_OES_standard_derivatives : enable\n" + FRAG;

    const prog = createProgram(gl, VERT, fragWithExt);
    if (!prog) return;
    const quad = createFullscreenQuad(gl);
    if (!quad) return;

    const posLoc = gl.getAttribLocation(prog, "a_pos");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uWells = gl.getUniformLocation(prog, "u_wells");

    const cursor = { x: 0, y: 0, hasMoved: false };
    const clicks: Well[] = [];
    const wellBuf = new Float32Array(7 * 4);

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

    // Convert event coords to shader uv space ((px - 0.5 * res) / minDim)
    const toShaderUV = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const d = dpr();
      const px = (clientX - rect.left) * d;
      const py = (rect.height - (clientY - rect.top)) * d;
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
      clicks.push({ x: p.x, y: p.y, mass: 1.0, t0: performance.now() });
      if (clicks.length > 6) clicks.shift();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);

    const t0 = performance.now();
    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      const now = performance.now();
      const t = (now - t0) / 1000;

      // Pack wells: index 0 = cursor, 1..6 = clicks
      wellBuf.fill(0);
      if (cursor.hasMoved) {
        wellBuf[0] = cursor.x;
        wellBuf[1] = cursor.y;
        wellBuf[2] = 0.6; // mass
        wellBuf[3] = 0.0;
      }
      for (let i = 0; i < clicks.length && i < 6; i++) {
        const c = clicks[i];
        const idx = (i + 1) * 4;
        wellBuf[idx + 0] = c.x;
        wellBuf[idx + 1] = c.y;
        wellBuf[idx + 2] = c.mass;
        wellBuf[idx + 3] = (now - c.t0) / 1000;
      }

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform4fv(uWells, wellBuf);
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
