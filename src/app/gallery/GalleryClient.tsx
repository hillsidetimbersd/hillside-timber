'use client'

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from 'react'
import { X, CaretLeft, CaretRight, ArrowUpRight, ArrowRight } from '@phosphor-icons/react'
import { sizePortfolioImage, type PortfolioProject } from '@/lib/portfolio'

// CDN request widths. Cards stay light; the lightbox stays crisp.
const HERO_COVER = 1600
const CARD_COVER = 800
const PEEK = 600
const THUMB = 240
const LB_MAIN = 1600

function ProjectCard({ project, featured = false, onOpen }: {
  project: PortfolioProject
  featured?: boolean
  onOpen: () => void
}) {
  const { title, category, count, images, cover } = project
  const coverSized = sizePortfolioImage(cover, featured ? HERO_COVER : CARD_COVER)
  const peekA = count >= 2 ? sizePortfolioImage(images[1], PEEK) : null
  const peekB = count >= 3 ? sizePortfolioImage(images[2], PEEK) : null

  return (
    <button
      type="button"
      className={`pcard${featured ? ' pcard--featured' : ''}`}
      onClick={onOpen}
      aria-label={`${title}. ${count} photo${count === 1 ? '' : 's'}. Open gallery.`}
    >
      <span className="pcard__stack">
        {peekB && <img className="pcard__peek pcard__peek--b" src={peekB} alt="" aria-hidden="true" loading="lazy" />}
        {peekA && <img className="pcard__peek pcard__peek--a" src={peekA} alt="" aria-hidden="true" loading="lazy" />}
        <span className="pcard__cover">
          <img src={coverSized} alt={`${title}, handcrafted by Hillside Timber`} loading={featured ? undefined : 'lazy'} />
          <span className="pcard__scrim" aria-hidden="true" />
          <span className="pcard__cta" aria-hidden="true"><ArrowUpRight size={featured ? 20 : 17} weight="bold" /></span>
          {count > 1 && <span className="pcard__count">{count} photos</span>}
          <span className="pcard__meta">
            <span className="pcard__eyebrow">{category}</span>
            <span className="pcard__title">{title}</span>
          </span>
        </span>
      </span>
    </button>
  )
}

function Lightbox({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  const { images, title, category, count, productUrl } = project
  const [i, setI] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const touchX = useRef<number | null>(null)

  const go = useCallback((d: number) => setI((p) => (p + d + count) % count), [count])

  // Body scroll lock, keyboard nav, focus capture + restore.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    rootRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); return }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); return }
      if (e.key === 'Tab') {
        // Trap focus inside the dialog so Tab never lands on the page behind it.
        const root = rootRef.current
        if (!root) return
        const f = root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        const act = document.activeElement
        if (e.shiftKey && (act === first || act === root)) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && act === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [go, onClose])

  // Keep the active thumbnail in view and preload the neighbours for instant nav.
  useEffect(() => {
    thumbRefs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    for (const k of [i + 1, i - 1]) {
      const idx = (k + count) % count
      const img = new Image()
      img.src = sizePortfolioImage(images[idx], LB_MAIN)
    }
  }, [i, images, count])

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <div
      className="lb"
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, photo gallery`}
      onClick={onClose}
    >
      <div className="lb__bar" onClick={stop}>
        <span className="lb__titles">
          <span className="lb__eyebrow">{category}</span>
          <span className="lb__title">{title}</span>
        </span>
        <span className="lb__count">{i + 1} / {count}</span>
        <button type="button" className="lb__close" onClick={onClose} aria-label="Close gallery">
          <X size={20} weight="bold" />
        </button>
      </div>

      <div className="lb__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {count > 1 && (
          <button type="button" className="lb__nav lb__nav--prev" onClick={(e) => { stop(e); go(-1) }} aria-label="Previous photo">
            <CaretLeft size={26} weight="bold" />
          </button>
        )}
        <img className="lb__img" onClick={stop} src={sizePortfolioImage(images[i], LB_MAIN)} alt={`${title} — photo ${i + 1} of ${count}`} />
        {count > 1 && (
          <button type="button" className="lb__nav lb__nav--next" onClick={(e) => { stop(e); go(1) }} aria-label="Next photo">
            <CaretRight size={26} weight="bold" />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="lb__strip" onClick={stop}>
          {images.map((im, idx) => (
            <button
              type="button"
              key={im}
              ref={(el) => { thumbRefs.current[idx] = el }}
              className={`lb__thumb${idx === i ? ' lb__thumb--active' : ''}`}
              onClick={() => setI(idx)}
              aria-label={`Go to photo ${idx + 1}`}
              aria-current={idx === i}
            >
              <img src={sizePortfolioImage(im, THUMB)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="lb__foot" onClick={stop}>
        <a className="lb__cta" href="/custom">
          Want a piece like this? Start a custom project <ArrowRight size={15} weight="bold" />
        </a>
        <a className="lb__link" href={productUrl} target="_blank" rel="noopener noreferrer">
          View on hillsidetimber.com ↗
        </a>
      </div>
    </div>
  )
}

export default function GalleryClient({ projects }: { projects: PortfolioProject[] }) {
  const [active, setActive] = useState<number | null>(null)

  if (projects.length === 0) {
    return (
      <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)' }}>
        <div className="g-sec g-pad" style={{ padding: '120px var(--section-pad-x) 160px', textAlign: 'center' }}>
          <div className="label" style={{ marginBottom: 14 }}>Portfolio</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4vw, 52px)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 16 }}>
            Gallery is loading fresh
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--gray-dark)', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
            We could not reach the project archive just now. You can view the full finished-work gallery on our main site.
          </p>
          <a href="https://www.hillsidetimber.com/photo-gallery" target="_blank" rel="noopener noreferrer" className="btn-primary">
            View the gallery
          </a>
        </div>
      </div>
    )
  }

  const [featured, ...rest] = projects

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))', background: 'var(--cream)' }}>
      <style>{STYLES}</style>

      <header className="g-sec g-pad g-head">
        <div className="label" style={{ marginBottom: 14 }}>Portfolio · Finished Work</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 6vw, 92px)', fontWeight: 800,
          letterSpacing: '-2px', lineHeight: 0.92, textTransform: 'uppercase', color: 'var(--black)', marginBottom: 20,
        }}>
          Built to be<br /><span style={{ color: 'var(--green)' }}>lived with.</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--fs-17)', color: 'var(--gray-dark)',
          maxWidth: 'var(--content-text)', lineHeight: 1.75, fontStyle: 'italic',
        }}>
          Every project here is a real piece we built, photographed in full. Open any one to step through the
          grain, the joinery, and the finished result, the same way it left the shop.
        </p>
      </header>

      <section className="g-sec g-pad">
        <ProjectCard project={featured} featured onOpen={() => setActive(0)} />
      </section>

      {rest.length > 0 && (
        <section className="g-sec g-pad g-grid-sec">
          <div className="pgrid">
            {rest.map((p, idx) => (
              <div key={p.id} className="gcard-enter" style={{ animationDelay: `${(idx % 3) * 90}ms` }}>
                <ProjectCard project={p} onOpen={() => setActive(idx + 1)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {active !== null && <Lightbox project={projects[active]} onClose={() => setActive(null)} />}
    </div>
  )
}

const STYLES = `
.g-sec { max-width: var(--content-max); margin: 0 auto; }
.g-pad { padding-left: var(--section-pad-x); padding-right: var(--section-pad-x); }
.g-head { padding-top: 72px; padding-bottom: 44px; }
.g-grid-sec { padding-top: 44px; padding-bottom: 100px; }
@media (max-width: 680px) {
  .g-pad { padding-left: 22px; padding-right: 22px; }
  .g-head { padding-top: 48px; padding-bottom: 30px; }
  .g-grid-sec { padding-top: 30px; padding-bottom: 64px; }
}

.pgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
@media (max-width: 1100px) { .pgrid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
@media (max-width: 680px)  { .pgrid { grid-template-columns: 1fr; gap: 20px; } }

/* Pure-CSS entrance: runs on load, needs no JS, and degrades to visible. */
.gcard-enter { animation: gcardIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes gcardIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .gcard-enter { animation: none; } }

/* ── Project card: photo-forward with a fanning photo-stack on hover ── */
.pcard {
  all: unset;
  box-sizing: border-box;
  display: block;
  width: 100%;
  position: relative;
  cursor: pointer;
}
.pcard:focus-visible { outline: 3px solid var(--green); outline-offset: 5px; border-radius: var(--radius-lg); }
.pcard:hover, .pcard:focus-visible { z-index: 5; }

.pcard__stack { position: relative; display: block; width: 100%; aspect-ratio: 4 / 3; }
.pcard--featured .pcard__stack { aspect-ratio: 16 / 9; }
@media (max-width: 680px) { .pcard--featured .pcard__stack { aspect-ratio: 4 / 3; } }

.pcard__peek {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; border-radius: var(--radius);
  box-shadow: var(--shadow); opacity: 0; z-index: 1;
  transform: translate(0, 0) rotate(0deg); transform-origin: center 70%;
}

.pcard__cover {
  position: absolute; inset: 0; display: block; z-index: 3;
  border-radius: var(--radius-lg); overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease;
}
.pcard__cover > img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
.pcard__scrim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,15,13,0.82) 0%, rgba(15,15,13,0.16) 44%, rgba(15,15,13,0) 68%); }

.pcard__meta { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 24px; display: flex; flex-direction: column; gap: 5px; }
.pcard__eyebrow { font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--tan); }
.pcard__title { font-family: var(--font-display); font-weight: 800; letter-spacing: -0.2px; text-transform: uppercase; color: #fff; line-height: 1.02; font-size: clamp(19px, 1.7vw, 24px); }
.pcard--featured .pcard__title { font-size: clamp(30px, 4.2vw, 56px); }

.pcard__count {
  position: absolute; top: 16px; right: 16px;
  font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--black); background: rgba(248,246,241,0.94); padding: 6px 11px; border-radius: 999px; box-shadow: var(--shadow-sm);
}
.pcard__cta {
  position: absolute; top: 15px; left: 15px; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center; border-radius: 999px;
  background: var(--green); color: #fff; opacity: 0; transform: scale(0.8);
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1);
}

@media (prefers-reduced-motion: no-preference) {
  .pcard:hover .pcard__cover, .pcard:focus-visible .pcard__cover { transform: translateY(-10px); box-shadow: var(--shadow-lg); }
  .pcard:hover .pcard__cover > img, .pcard:focus-visible .pcard__cover > img { transform: scale(1.05); }
  .pcard:hover .pcard__peek--a, .pcard:focus-visible .pcard__peek--a { opacity: 1; transform: translate(13px, -18px) rotate(6deg); }
  .pcard:hover .pcard__peek--b, .pcard:focus-visible .pcard__peek--b { opacity: 1; transform: translate(-13px, -11px) rotate(-5deg); }
  .pcard:hover .pcard__cta, .pcard:focus-visible .pcard__cta { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .pcard:hover .pcard__cover, .pcard:focus-visible .pcard__cover { box-shadow: var(--shadow-lg); }
  .pcard:hover .pcard__cta, .pcard:focus-visible .pcard__cta { opacity: 1; transform: scale(1); }
}

/* ── Lightbox carousel ── */
.lb {
  position: fixed; inset: 0; z-index: 120;
  background: rgba(12,12,10,0.97);
  display: flex; flex-direction: column; gap: 14px;
  padding: clamp(14px, 2.4vw, 26px);
  animation: lbIn 0.26s ease both;
}
@keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .lb { animation: none; } }

.lb__bar { display: flex; align-items: center; gap: 16px; }
.lb__titles { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.lb__eyebrow { font-family: var(--font-display); font-size: var(--fs-10); font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--tan); }
.lb__title { font-family: var(--font-display); font-size: clamp(17px, 2.2vw, 26px); font-weight: 800; letter-spacing: -0.2px; text-transform: uppercase; color: #fff; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lb__count { margin-left: auto; font-family: var(--font-display); font-size: var(--fs-13); font-weight: 700; letter-spacing: 1.5px; color: rgba(255,255,255,0.65); }
.lb__close { all: unset; box-sizing: border-box; cursor: pointer; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 999px; color: #fff; background: rgba(255,255,255,0.08); transition: background 0.2s ease; }
.lb__close:hover { background: rgba(255,255,255,0.18); }
.lb__close:focus-visible { outline: 2px solid var(--tan); outline-offset: 2px; }

.lb__stage { position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.lb__img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: var(--radius); box-shadow: 0 30px 80px rgba(0,0,0,0.5); }
.lb__nav { all: unset; box-sizing: border-box; cursor: pointer; position: absolute; top: 50%; transform: translateY(-50%); width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 999px; color: #fff; background: rgba(20,20,18,0.55); backdrop-filter: blur(6px); transition: background 0.2s ease; z-index: 2; }
.lb__nav:hover { background: var(--green); }
.lb__nav:focus-visible { outline: 2px solid var(--tan); outline-offset: 2px; }
.lb__nav--prev { left: 6px; }
.lb__nav--next { right: 6px; }

.lb__strip { display: flex; gap: 10px; overflow-x: auto; padding: 4px 2px 6px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; }
.lb__thumb { all: unset; box-sizing: border-box; cursor: pointer; flex: 0 0 auto; width: 84px; height: 60px; border-radius: 6px; overflow: hidden; opacity: 0.45; outline: 2px solid transparent; outline-offset: 0; transition: opacity 0.2s ease, outline-color 0.2s ease; }
.lb__thumb > img { width: 100%; height: 100%; object-fit: cover; display: block; }
.lb__thumb:hover { opacity: 0.85; }
.lb__thumb--active { opacity: 1; outline-color: var(--tan); }
.lb__thumb:focus-visible { outline-color: #fff; }

.lb__foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.lb__cta { font-family: var(--font-display); font-size: var(--fs-12); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border-bottom: 1.5px solid var(--tan); padding-bottom: 3px; transition: color 0.2s ease; }
.lb__cta:hover { color: var(--tan); }
.lb__link { font-family: var(--font-body); font-style: italic; font-size: var(--fs-13); color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.2s ease; }
.lb__link:hover { color: rgba(255,255,255,0.85); }

@media (max-width: 680px) {
  .lb__nav { width: 44px; height: 44px; }
  .lb__thumb { width: 64px; height: 46px; }
  .lb__link { display: none; }
}
`
