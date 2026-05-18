"use client";

import { useEffect, useRef } from "react";
import { createProgram, createFullscreenQuad, dpr } from "./glUtils";
import { WaveSim } from "./WaveSim";

// Chrome surface lit by a GPU height-field simulation. Clicks add gaussian
// impulses to a persistent height field — successive clicks accumulate energy
// rather than starting fresh ripples. Pointer drag leaves a continuous wake.

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in  vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_height;
uniform vec2  u_res;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  float minDim = min(u_res.x, u_res.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / minDim;

  // Read height field + neighbors to compute live surface normals
  vec2 simUV = v_uv;
  vec2 texel = 1.0 / vec2(textureSize(u_height, 0));
  float hC = texture(u_height, simUV).r;
  float hE = texture(u_height, simUV + vec2(texel.x, 0.0)).r;
  float hW = texture(u_height, simUV - vec2(texel.x, 0.0)).r;
  float hN = texture(u_height, simUV + vec2(0.0, texel.y)).r;
  float hS = texture(u_height, simUV - vec2(0.0, texel.y)).r;

  vec3 simN = normalize(vec3(-(hE - hW) * 6.0, -(hN - hS) * 6.0, 0.5));

  // Static fbm base for the chrome material (always present, makes the surface
  // feel material even when undisturbed)
  vec2 p = uv;
  float t = u_time * 0.06;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 s = vec2(fbm(p + 3.0 * q + t), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float n = fbm(p + 2.5 * s);

  float eps = 0.003;
  float nx = fbm(p + 2.5 * s + vec2(eps, 0.0)) - fbm(p + 2.5 * s - vec2(eps, 0.0));
  float ny = fbm(p + 2.5 * s + vec2(0.0, eps)) - fbm(p + 2.5 * s - vec2(0.0, eps));
  vec3 noiseN = normalize(vec3(-nx, -ny, 0.08));

  vec3 N = normalize(noiseN * 0.45 + simN * 1.6);

  vec3 L1 = normalize(vec3( 0.55,  0.65,  0.5));
  vec3 L2 = normalize(vec3(-0.6, -0.45,  0.45));
  float k1 = max(dot(N, L1), 0.0);
  float k2 = max(dot(N, L2), 0.0);

  vec3 base = mix(vec3(0.09, 0.10, 0.12),
                  vec3(0.97, 0.95, 0.90),
                  smoothstep(0.20, 0.85, n + hC * 0.6));

  vec3 gold = vec3(0.957, 0.769, 0.188);
  vec3 navy = vec3(0.118, 0.357, 0.659);

  vec3 col = base
           + gold * pow(k1, 4.0) * 0.7
           + navy * pow(k2, 3.0) * 0.55;

  vec3 H = normalize(L1 + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), 36.0);
  col += vec3(1.0) * spec * 0.55;

  float vig = smoothstep(1.3, 0.55, length(uv));
  col *= 0.85 + 0.15 * vig;

  outColor = vec4(col, 1.0);
}`;

export default function LiquidChrome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: true, alpha: false });
    if (!gl) {
      if (errRef.current) errRef.current.style.display = "flex";
      return;
    }

    let sim: WaveSim;
    try {
      sim = new WaveSim(gl, 256);
    } catch (e) {
      console.warn("LiquidChrome: WaveSim unavailable", e);
      if (errRef.current) errRef.current.style.display = "flex";
      return;
    }

    const prog = createProgram(gl, VERT, FRAG);
    if (!prog) return;
    const quad = createFullscreenQuad(gl);
    if (!quad) return;

    const posLoc = gl.getAttribLocation(prog, "a_pos");
    const uHeight = gl.getUniformLocation(prog, "u_height");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const target = { x: 0.5, y: 0.5 };
    let last = { x: 0.5, y: 0.5 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr()));
      const h = Math.max(1, Math.floor(rect.height * dpr()));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const toUV = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        u: (clientX - rect.left) / rect.width,
        v: 1 - (clientY - rect.top) / rect.height,
      };
    };

    const onMove = (e: PointerEvent) => {
      const { u, v } = toUV(e.clientX, e.clientY);
      target.x = u;
      target.y = v;
    };
    const onDown = (e: PointerEvent) => {
      const { u, v } = toUV(e.clientX, e.clientY);
      sim.addImpulse(u, v, 0.9);
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

      // Continuous wake from pointer movement — strength proportional to speed
      const dx = target.x - last.x;
      const dy = target.y - last.y;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.001) {
        sim.addImpulse(target.x, target.y, Math.min(speed * 1.5, 0.08));
      }
      last = { x: target.x, y: target.y };

      // Step the sim (single step per frame is enough for visible wave action)
      sim.step(0.997, 5.0);

      // Composite to canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sim.getTexture());
      gl.uniform1i(uHeight, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
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
      sim.destroy();
      gl.deleteProgram(prog);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
        aria-hidden
      />
      <div
        ref={errRef}
        style={{ display: "none" }}
        className="absolute inset-0 items-center justify-center text-cream-100/70 text-sm tracking-[0.12em] uppercase"
      >
        WebGL2 not available
      </div>
    </>
  );
}
