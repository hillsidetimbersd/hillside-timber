'use client'

import { useBrand } from '@/components/brand/BrandContext'
import { InstagramLogo } from '@phosphor-icons/react'

const LOCAL_PHOTOS = [
  { id: '01', src: '/instagram/01.jpg', permalink: 'https://instagram.com/hillsidetimber' },
  { id: '02', src: '/instagram/02.jpg', permalink: 'https://instagram.com/hillsidetimber' },
  { id: '03', src: '/instagram/03.jpg', permalink: 'https://instagram.com/hillsidetimber' },
  { id: '04', src: '/instagram/04.jpg', permalink: 'https://instagram.com/hillsidetimber' },
  { id: '05', src: '/instagram/05.jpg', permalink: 'https://instagram.com/hillsidetimber' },
  { id: '06', src: '/instagram/06.jpg', permalink: 'https://instagram.com/hillsidetimber' },
]

export default function InstagramFeed() {
  const brand = useBrand()
  const display = LOCAL_PHOTOS

  return (
    <section style={{
      padding: '100px 60px',
      background: 'var(--cream)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 40,
        }}>
          <div>
            <div className="label" style={{ marginBottom: 10 }}>Follow Along</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 3.5vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
              color: 'var(--black)',
              lineHeight: 0.95,
            }}>
              {brand.instagramHandle}
            </h2>
          </div>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--black)',
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1.5px solid var(--black)',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--black)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--black)'
            }}
          >
            <InstagramLogo size={16} />
            View Profile
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 4,
        }}>
          {display.map((post) => (
            <a
              key={post.id}
              href={post.permalink || brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                aspectRatio: '1',
                overflow: 'hidden',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) img.style.transform = 'scale(1.06)'
                const overlay = e.currentTarget.querySelector('.ig-overlay') as HTMLElement
                if (overlay) overlay.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img')
                if (img) img.style.transform = 'scale(1)'
                const overlay = e.currentTarget.querySelector('.ig-overlay') as HTMLElement
                if (overlay) overlay.style.opacity = '0'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.src}
                alt="Instagram post"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
              />
              <div
                className="ig-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(42,92,63,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
              >
                <InstagramLogo size={28} color="#fff" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
