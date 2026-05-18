"use client";

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 a_pos;
  void main() {
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform vec3  u_ripples[8];

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
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float minDim = min(u_res.x, u_res.y);
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / minDim;
    vec2 m  = (u_mouse        - 0.5 * u_res.xy) / minDim;

    // Bend space toward the cursor — gummy pull, falls off with distance
    vec2 dir = uv - m;
    float r = length(dir);
    float pull = exp(-r * 2.6) * 0.35;
    vec2 p = uv - dir * pull;

    // Domain-warped fbm — the "liquid" part
    float t = u_time * 0.08;
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 s = vec2(fbm(p + 4.0 * q + t), fbm(p + 4.0 * q + vec2(8.3, 2.8) - t));
    float n = fbm(p + 3.0 * s);

    // Click ripples — each contributes a decaying sine wave
    for (int i = 0; i < 8; i++) {
      vec3 R = u_ripples[i];
      if (R.z > 0.0) {
        vec2 rp = (R.xy - 0.5 * u_res.xy) / minDim;
        float dist = length(uv - rp);
        float age = R.z;
        float wave = sin(dist * 26.0 - age * 9.0) * exp(-dist * 2.2) * exp(-age * 1.4);
        n += wave * 0.22;
      }
    }

    // Faux surface normals from noise gradient — gives the "chrome" reflectivity
    float eps = 0.0025;
    float nx = fbm(p + 3.0 * s + vec2(eps, 0.0)) - fbm(p + 3.0 * s - vec2(eps, 0.0));
    float ny = fbm(p + 3.0 * s + vec2(0.0, eps)) - fbm(p + 3.0 * s - vec2(0.0, eps));
    vec3 N = normalize(vec3(-nx, -ny, 0.05));

    // Two brand-tinted lights
    vec3 L1 = normalize(vec3( 0.55,  0.65,  0.5));
    vec3 L2 = normalize(vec3(-0.6, -0.45,  0.45));

    float k1 = max(dot(N, L1), 0.0);
    float k2 = max(dot(N, L2), 0.0);

    // Chrome base: deep ink → near-cream, gated by the noise field
    vec3 base = mix(vec3(0.09, 0.10, 0.12),
                    vec3(0.97, 0.95, 0.90),
                    smoothstep(0.25, 0.85, n));

    vec3 gold = vec3(0.957, 0.769, 0.188);
    vec3 navy = vec3(0.118, 0.357, 0.659);

    vec3 col = base
             + gold * pow(k1, 4.0) * 0.65
             + navy * pow(k2, 3.0) * 0.55;

    // Specular streak — the chrome glint
    vec3 H = normalize(L1 + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(N, H), 0.0), 28.0);
    col += vec3(1.0) * spec * 0.45;

    // Subtle vignette
    float vig = smoothstep(1.25, 0.55, length(uv));
    col *= 0.85 + 0.15 * vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function LiquidChrome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uRipple = gl.getUniformLocation(prog, "u_ripples");

    const mouseTarget = { x: 0, y: 0 };
    const mouseSmooth = { x: 0, y: 0 };
    type Ripple = { x: number; y: number; t0: number };
    const ripples: Ripple[] = [];

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr()));
      const h = Math.max(1, Math.floor(rect.height * dpr()));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      // Recenter pointer if it hasn't moved yet
      if (mouseTarget.x === 0 && mouseTarget.y === 0) {
        mouseTarget.x = w * 0.5;
        mouseTarget.y = h * 0.5;
        mouseSmooth.x = mouseTarget.x;
        mouseSmooth.y = mouseTarget.y;
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Convert event coords → canvas pixels with origin bottom-left (matches gl_FragCoord)
    const toCanvas = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const d = dpr();
      return {
        x: (clientX - rect.left) * d,
        y: (rect.height - (clientY - rect.top)) * d,
      };
    };

    const onMove = (e: PointerEvent) => {
      const p = toCanvas(e.clientX, e.clientY);
      mouseTarget.x = p.x;
      mouseTarget.y = p.y;
    };

    const onDown = (e: PointerEvent) => {
      const p = toCanvas(e.clientX, e.clientY);
      ripples.push({ x: p.x, y: p.y, t0: performance.now() });
      if (ripples.length > 8) ripples.shift();
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);

    const t0 = performance.now();
    const rippleBuf = new Float32Array(8 * 3);
    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      const now = performance.now();
      const t = (now - t0) / 1000;

      // Damp pointer
      const k = 0.12;
      mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * k;
      mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * k;

      // Drop expired ripples (>3.5s)
      while (ripples.length > 0 && (now - ripples[0].t0) / 1000 > 3.5) {
        ripples.shift();
      }
      rippleBuf.fill(0);
      for (let i = 0; i < ripples.length && i < 8; i++) {
        const r = ripples[i];
        rippleBuf[i * 3 + 0] = r.x;
        rippleBuf[i * 3 + 1] = r.y;
        rippleBuf[i * 3 + 2] = (now - r.t0) / 1000;
      }

      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseSmooth.x, mouseSmooth.y);
      gl.uniform3fv(uRipple, rippleBuf);
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
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
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
