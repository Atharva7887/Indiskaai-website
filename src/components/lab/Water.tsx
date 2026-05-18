"use client";

import { useEffect, useRef } from "react";
import { createProgram, createFullscreenQuad, dpr } from "./glUtils";
import { WaveSim } from "./WaveSim";

// Top-down pool of water. Same height-field simulation as LiquidChrome, but
// rendered as refractive water with sun caustics dancing on the pool floor.

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

// Sun caustics — slowly-shifting interference pattern, distorted by water normals
float caustic(vec2 p, float t) {
  vec2 i = p;
  float c = 1.0;
  float inten = 0.0035;
  for (int n = 0; n < 4; n++) {
    float ti = t * 0.6 + float(n) * 1.7;
    i = p + vec2(cos(ti - i.x) + sin(ti + i.y),
                 sin(ti - i.y) + cos(ti + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + ti) / inten),
                           p.y / (cos(i.y + ti) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 6.0), 0.0, 1.0);
}

void main() {
  vec2 uv = v_uv;
  vec2 texel = 1.0 / vec2(textureSize(u_height, 0));

  float hC = texture(u_height, uv).r;
  float hE = texture(u_height, uv + vec2(texel.x, 0.0)).r;
  float hW = texture(u_height, uv - vec2(texel.x, 0.0)).r;
  float hN = texture(u_height, uv + vec2(0.0, texel.y)).r;
  float hS = texture(u_height, uv - vec2(0.0, texel.y)).r;

  vec2 grad = vec2(hE - hW, hN - hS);

  // Distort caustic-sampling coords by the water surface gradient — gives
  // refraction-like wobble where the surface tilts
  vec2 cp = (uv - 0.5) * 3.0 + grad * 12.0;
  float c = caustic(cp, u_time);

  // Depth tint — deep teal at rest, lighter where the water rises
  vec3 deep    = vec3(0.04, 0.18, 0.30);
  vec3 shallow = vec3(0.42, 0.78, 0.88);
  vec3 col = mix(deep, shallow, smoothstep(-0.3, 0.6, hC + 0.2));

  // Add caustic light
  col += vec3(1.0, 0.92, 0.65) * c * 0.85;

  // Specular highlight from surface normals
  vec3 N = normalize(vec3(-grad.x * 8.0, -grad.y * 8.0, 0.4));
  vec3 L = normalize(vec3(0.4, 0.5, 0.8));
  float spec = pow(max(dot(N, L), 0.0), 28.0);
  col += vec3(1.0, 0.97, 0.85) * spec * 0.7;

  // Edge darkening as if the pool has rim shadow
  vec2 d = abs(uv - 0.5) * 2.0;
  float edge = smoothstep(1.05, 0.7, max(d.x, d.y));
  col *= 0.7 + 0.3 * edge;

  outColor = vec4(col, 1.0);
}`;

export default function Water() {
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
      console.warn("Water: WaveSim unavailable", e);
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

    const toUV = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      return { u: (cx - r.left) / r.width, v: 1 - (cy - r.top) / r.height };
    };
    const onMove = (e: PointerEvent) => {
      const { u, v } = toUV(e.clientX, e.clientY);
      target.x = u;
      target.y = v;
    };
    const onDown = (e: PointerEvent) => {
      const { u, v } = toUV(e.clientX, e.clientY);
      sim.addImpulse(u, v, 1.1);
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

      const dx = target.x - last.x;
      const dy = target.y - last.y;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.001) {
        sim.addImpulse(target.x, target.y, Math.min(speed * 1.8, 0.1));
      }
      last = { x: target.x, y: target.y };

      sim.step(0.997, 4.5);

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
