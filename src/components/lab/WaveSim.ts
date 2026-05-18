import { createProgram, createFullscreenQuad } from "./glUtils";

// Ping-pong height-field water simulation.
// Texture format: RG16F. Channel R = height, G = velocity.
// Each frame, the laplacian of the height field accelerates the velocity,
// velocity decays via damping, height integrates by velocity. Splats
// (clicks, drags) are added as gaussian bumps on top of the height channel,
// which makes them feel additive — successive clicks build energy rather
// than each starting a fresh isolated ripple.

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const SIM_FRAG = `#version 300 es
precision highp float;
in  vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_prev;
uniform vec2  u_texelSize;
uniform float u_damping;
uniform float u_splatRadius;   // in texels
uniform int   u_numSplats;
uniform vec3  u_splats[8];     // (uv.x, uv.y, strength)

void main() {
  vec4 c = texture(u_prev, v_uv);
  float h = c.r;
  float v = c.g;

  // 4-neighbor laplacian (with clamp-to-edge providing reflective-ish boundary)
  float hN = texture(u_prev, v_uv + vec2(0.0, u_texelSize.y)).r;
  float hS = texture(u_prev, v_uv - vec2(0.0, u_texelSize.y)).r;
  float hE = texture(u_prev, v_uv + vec2(u_texelSize.x, 0.0)).r;
  float hW = texture(u_prev, v_uv - vec2(u_texelSize.x, 0.0)).r;
  float lap = (hN + hS + hE + hW) * 0.25 - h;

  // Wave equation (discretized)
  v += lap * 0.5;
  v *= u_damping;
  h += v;

  // Splats — accumulate as gaussian bumps into height (preserves continuity)
  vec2 px = v_uv / u_texelSize;
  for (int i = 0; i < 8; i++) {
    if (i >= u_numSplats) break;
    vec3 sp = u_splats[i];
    vec2 spPx = sp.xy / u_texelSize;
    float d = length(px - spPx);
    float g = exp(-(d * d) / (u_splatRadius * u_splatRadius));
    h += sp.z * g;
  }

  // Soft clamp to keep the sim numerically tame
  h = clamp(h, -2.0, 2.0);
  v = clamp(v, -1.0, 1.0);

  outColor = vec4(h, v, 0.0, 1.0);
}`;

export class WaveSim {
  private gl: WebGL2RenderingContext;
  private size: number;
  private texA: WebGLTexture;
  private texB: WebGLTexture;
  private fboA: WebGLFramebuffer;
  private fboB: WebGLFramebuffer;
  private current: 0 | 1 = 0;
  private prog: WebGLProgram;
  private quad: WebGLBuffer;
  private posLoc: number;
  private u: {
    prev: WebGLUniformLocation | null;
    texel: WebGLUniformLocation | null;
    damping: WebGLUniformLocation | null;
    splatRadius: WebGLUniformLocation | null;
    splats: WebGLUniformLocation | null;
    numSplats: WebGLUniformLocation | null;
  };
  private pending: { x: number; y: number; strength: number }[] = [];
  private splatBuf = new Float32Array(8 * 3);

  constructor(gl: WebGL2RenderingContext, size = 256) {
    this.gl = gl;
    this.size = size;

    // Need to render to float/half-float framebuffer.
    if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) {
      throw new Error("EXT_color_buffer_float / half_float not supported");
    }

    this.texA = this.makeTex();
    this.texB = this.makeTex();
    this.fboA = this.makeFBO(this.texA);
    this.fboB = this.makeFBO(this.texB);

    const prog = createProgram(gl, VERT, SIM_FRAG);
    if (!prog) throw new Error("WaveSim shader failed to compile");
    this.prog = prog;
    const quad = createFullscreenQuad(gl);
    if (!quad) throw new Error("Failed to create quad buffer");
    this.quad = quad;

    this.posLoc = gl.getAttribLocation(prog, "a_pos");
    this.u = {
      prev: gl.getUniformLocation(prog, "u_prev"),
      texel: gl.getUniformLocation(prog, "u_texelSize"),
      damping: gl.getUniformLocation(prog, "u_damping"),
      splatRadius: gl.getUniformLocation(prog, "u_splatRadius"),
      splats: gl.getUniformLocation(prog, "u_splats"),
      numSplats: gl.getUniformLocation(prog, "u_numSplats"),
    };
  }

  private makeTex(): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture();
    if (!tex) throw new Error("createTexture failed");
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, this.size, this.size, 0, gl.RG, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  private makeFBO(tex: WebGLTexture): WebGLFramebuffer {
    const gl = this.gl;
    const fbo = gl.createFramebuffer();
    if (!fbo) throw new Error("createFramebuffer failed");
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("FBO incomplete: " + status);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return fbo;
  }

  // Queue a splat. (x, y) are in [0,1] UV space (origin bottom-left).
  addImpulse(x: number, y: number, strength: number) {
    if (this.pending.length >= 8) this.pending.shift();
    this.pending.push({ x, y, strength });
  }

  step(damping = 0.996, splatRadiusTexels = 6.0) {
    const gl = this.gl;
    const src = this.current === 0 ? this.texA : this.texB;
    const dst = this.current === 0 ? this.fboB : this.fboA;

    gl.bindFramebuffer(gl.FRAMEBUFFER, dst);
    gl.viewport(0, 0, this.size, this.size);
    gl.useProgram(this.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(this.posLoc);
    gl.vertexAttribPointer(this.posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src);
    gl.uniform1i(this.u.prev, 0);
    gl.uniform2f(this.u.texel, 1 / this.size, 1 / this.size);
    gl.uniform1f(this.u.damping, damping);
    gl.uniform1f(this.u.splatRadius, splatRadiusTexels);

    this.splatBuf.fill(0);
    const n = Math.min(this.pending.length, 8);
    for (let i = 0; i < n; i++) {
      this.splatBuf[i * 3 + 0] = this.pending[i].x;
      this.splatBuf[i * 3 + 1] = this.pending[i].y;
      this.splatBuf[i * 3 + 2] = this.pending[i].strength;
    }
    gl.uniform1i(this.u.numSplats, n);
    gl.uniform3fv(this.u.splats, this.splatBuf);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.pending.length = 0;
    this.current = this.current === 0 ? 1 : 0;
  }

  getTexture(): WebGLTexture {
    return this.current === 0 ? this.texA : this.texB;
  }

  destroy() {
    const gl = this.gl;
    gl.deleteTexture(this.texA);
    gl.deleteTexture(this.texB);
    gl.deleteFramebuffer(this.fboA);
    gl.deleteFramebuffer(this.fboB);
    gl.deleteProgram(this.prog);
    gl.deleteBuffer(this.quad);
  }
}
