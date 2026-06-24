'use client'

import { useEffect, useRef } from 'react'

const VERT = `
  varying vec2 vUv;
  uniform vec3 uDisplacement;
  uniform float uRadius;
  uniform float uHeight;
  float easeInOutCubic(float x){ return x < 0.5 ? 4.*x*x*x : 1. - pow(-2.*x + 2., 3.)/2.; }
  void main(){
    vUv = uv;
    vec3 p = position;
    vec3 world = (modelMatrix * vec4(position, 1.)).xyz;
    float d = distance(uDisplacement, world);
    if (d < uRadius){
      float m = 1. - (d / uRadius);
      p.z += easeInOutCubic(m) * uHeight;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }
`

const FRAG = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main(){
    vec4 c = texture2D(uTexture, vUv);
    if (c.a < 0.02) discard;
    gl_FragColor = vec4(c.rgb, c.a);
  }
`

// next/font self-hosts Barlow under a generated family name AND a metrics-matched
// fallback (Arial-based). Pick the real one, never the "...Fallback..." face.
function barlowFamily(): string {
  try {
    const fonts = document.fonts as unknown as Iterable<FontFace>
    let fallback = ''
    for (const f of fonts) {
      if (!/barlow/i.test(f.family)) continue
      if (/fallback/i.test(f.family)) { fallback = f.family; continue }
      return `'${f.family.replace(/^['"]|['"]$/g, '')}'`
    }
    if (fallback) return `'${fallback.replace(/^['"]|['"]$/g, '')}'`
  } catch {
    /* fall through */
  }
  return `'Barlow Condensed', system-ui, sans-serif`
}

// Draw the word into a canvas sized snugly around it, so the plane carries no
// dead vertical space — the text fills its box.
async function makeTextTexture(THREE: typeof import('three'), text: string) {
  try {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready
  } catch {
    /* draw with whatever is available */
  }
  const fam = barlowFamily()
  const label = text.toUpperCase()
  const REF = 300
  const LS = 16

  type Ctx2D = CanvasRenderingContext2D & { letterSpacing?: string }
  const measure = document.createElement('canvas').getContext('2d') as Ctx2D
  if (!measure) throw new Error('no 2d context')
  measure.letterSpacing = `${LS}px`
  measure.font = `800 ${REF}px ${fam}`
  const m = measure.measureText(label)
  const ascent = m.actualBoundingBoxAscent || REF * 0.72
  const descent = m.actualBoundingBoxDescent || REF * 0.06
  const textW = Math.ceil(m.width)
  const textH = Math.ceil(ascent + descent)
  const padX = Math.round(REF * 0.08)
  const padY = Math.round(REF * 0.16)
  const cw = textW + padX * 2
  const ch = textH + padY * 2

  const scale = Math.min(1, 2048 / cw)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(cw * scale)
  canvas.height = Math.round(ch * scale)
  const ctx = canvas.getContext('2d') as Ctx2D
  if (!ctx) throw new Error('no 2d context')
  ctx.scale(scale, scale)
  ctx.letterSpacing = `${LS}px`
  ctx.font = `800 ${REF}px ${fam}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#f8f6f1'
  ctx.fillText(label, cw / 2, padY + ascent)

  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return { texture: tex, aspect: cw / ch }
}

export default function SaleDisplaceText({ text = 'On Sale' }: { text?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // The effect is entirely cursor-driven; on touch (no fine pointer) keep the
    // static fallback instead of shipping three.js + a render loop for nothing.
    if (!window.matchMedia('(pointer: fine)').matches) return

    let disposed = false
    let started = false
    let cleanup = () => {}

    const start = () => {
      if (started || disposed) return
      started = true
      void (async () => {
        const THREE = await import('three')
        if (disposed || !mountRef.current) return
        const el = mountRef.current

        const camera = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.1, 100)
        let renderer: import('three').WebGLRenderer
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        } catch {
          return // No WebGL — keep the static "On Sale" fallback.
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        el.appendChild(renderer.domElement)

        let made: { texture: import('three').CanvasTexture; aspect: number }
        try {
          made = await makeTextTexture(THREE, text)
        } catch {
          renderer.dispose()
          return
        }
        if (disposed) {
          made.texture.dispose()
          renderer.dispose()
          return
        }
        const { texture, aspect } = made

        const scene = new THREE.Scene()
        const PLANE_W = aspect
        const PLANE_H = 1
        const segX = Math.max(90, Math.round(aspect * 56))
        const geometry = new THREE.PlaneGeometry(PLANE_W, PLANE_H, segX, 64)
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uDisplacement: { value: new THREE.Vector3(999, 999, 999) },
            uRadius: { value: 0.7 },
            uHeight: { value: 0.26 },
          },
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthWrite: false,
        })
        const plane = new THREE.Mesh(geometry, material)
        scene.add(plane)

        const fit = () => {
          const w = el.clientWidth
          const h = el.clientHeight
          renderer.setSize(w, h)
          camera.aspect = w / h
          const half = (camera.fov * Math.PI) / 360
          const forH = (PLANE_H * 0.55) / Math.tan(half)
          const forW = (PLANE_W * 0.52) / (Math.tan(half) * camera.aspect)
          camera.position.set(0, 0, Math.max(forH, forW))
          camera.lookAt(0, 0, 0)
          camera.updateProjectionMatrix()
        }
        fit()

        if (fallbackRef.current) fallbackRef.current.style.opacity = '0'

        const raycaster = new THREE.Raycaster()
        const ndc = new THREE.Vector2()
        // "Off" = keep the last x/y but drop z just below the plane, so the ripple
        // switches off and back on instantly. (Parking it 999 units away made the
        // first hover travel a long way before anything happened — that was the lag.)
        const OFF_Z = -2.5
        const target = new THREE.Vector3(0, 0, OFF_Z)
        const current = new THREE.Vector3(0, 0, OFF_Z)
        let lastActive = performance.now()

        const onMove = (e: PointerEvent) => {
          const b = el.getBoundingClientRect()
          ndc.x = ((e.clientX - b.left) / b.width) * 2 - 1
          ndc.y = -((e.clientY - b.top) / b.height) * 2 + 1
          raycaster.setFromCamera(ndc, camera)
          const hit = raycaster.intersectObject(plane)
          if (hit.length) target.copy(hit[0].point)
          else target.z = OFF_Z
          lastActive = performance.now()
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('resize', fit)

        let visible = true
        const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting }, { rootMargin: '160px' })
        io.observe(el)

        // Initial straight frame
        material.uniforms.uDisplacement.value.copy(current)
        renderer.render(scene, camera)

        let raf = 0
        const loop = (now: number) => {
          raf = requestAnimationFrame(loop)
          if (!visible) return
          current.lerp(target, 0.35) // snappy follow
          // Only render while something is moving; once the ripple has settled
          // back to straight, stop drawing (the last frame persists on the canvas).
          if (now - lastActive < 1500) {
            material.uniforms.uDisplacement.value.copy(current)
            renderer.render(scene, camera)
          }
        }
        raf = requestAnimationFrame(loop)

        cleanup = () => {
          cancelAnimationFrame(raf)
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('resize', fit)
          io.disconnect()
          geometry.dispose()
          material.dispose()
          texture.dispose()
          renderer.dispose()
          if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
        }
      })()
    }

    // Load eagerly so the ripple is ready the instant the section is reached —
    // lazy-loading three.js made the first hover feel laggy. Rendering itself is
    // still paused while the section is off-screen (the visibility observer above).
    start()

    return () => {
      disposed = true
      cleanup()
    }
  }, [text])

  return (
    <div ref={mountRef} className="sale-gl" aria-hidden="true">
      <div ref={fallbackRef} className="sale-gl__fallback">{text}</div>
    </div>
  )
}
