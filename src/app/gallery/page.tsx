'use client'

import { useState } from 'react'

const CATEGORIES = ['All', 'Slabs', 'Finished Pieces', 'Process', 'Forest']

const PHOTOS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80', alt: 'Wood slab', cat: 'Slabs' },
  { id: 2, src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', alt: 'Finished table', cat: 'Finished Pieces' },
  { id: 3, src: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80', alt: 'Workshop', cat: 'Process' },
  { id: 4, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Burl wood', cat: 'Slabs' },
  { id: 5, src: 'https://images.unsplash.com/photo-1493515322954-4fa727e97985?w=800&q=80', alt: 'Wood grain', cat: 'Slabs' },
  { id: 6, src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', alt: 'Forest', cat: 'Forest' },
  { id: 7, src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', alt: 'Timber yard', cat: 'Process' },
  { id: 8, src: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80', alt: 'Woodworking detail', cat: 'Process' },
  { id: 9, src: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&q=80', alt: 'Finished piece', cat: 'Finished Pieces' },
  { id: 10, src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80', alt: 'SD forest', cat: 'Forest' },
  { id: 11, src: 'https://images.unsplash.com/photo-1472552944129-b035e9ea3744?w=800&q=80', alt: 'Standing timber', cat: 'Forest' },
  { id: 12, src: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80', alt: 'Ponderosa pines', cat: 'Forest' },
]

export default function GalleryPage() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const photos = active === 'All' ? PHOTOS : PHOTOS.filter((p) => p.cat === active)

  return (
    <div style={{ paddingTop: 'calc(var(--switcher-h) + var(--nav-h))' }}>
      <div style={{ padding: '60px 60px 0' }}>
        <div className="label" style={{ marginBottom: 12 }}>Portfolio</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)',
          fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase',
          color: 'var(--black)', lineHeight: 0.95, marginBottom: 40,
        }}>
          Gallery
        </h1>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '8px 16px',
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                border: `1px solid ${active === cat ? 'var(--green)' : 'var(--border)'}`,
                background: active === cat ? 'var(--green)' : '#fff',
                color: active === cat ? '#fff' : 'var(--gray-dark)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div style={{
        padding: '0 60px 80px',
        columns: '3 280px',
        columnGap: 16,
      }}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setLightbox(photo.src)}
            style={{ marginBottom: 16, breakInside: 'avoid', cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius)' }}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img')
              if (img) img.style.transform = 'scale(1.04)'
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img')
              if (img) img.style.transform = 'scale(1)'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(15,15,13,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.replace('w=800', 'w=1600')}
            alt="Gallery"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
