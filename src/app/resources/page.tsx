import type { Metadata } from 'next'
import Link from 'next/link'
import PieceTypeIcon from '@/components/calculators/PieceTypeIcon'

export const metadata: Metadata = {
  title: 'Free Resources · Hillside Timber',
  description:
    "Free tools and guides for planning your woodworking project. Calculate board feet, plan a dining table, and build a custom quote — no signup required.",
}

export default function ResourcesPage() {
  return (
    <div
      style={{
        paddingTop: 'calc(var(--switcher-h) + var(--nav-h))',
        background: 'var(--cream)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ padding: '80px var(--section-pad-x) 56px', borderBottom: '1px solid var(--border)' }}>
        <div className="label" style={{ marginBottom: 14 }}>Free Resources</div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(54px, 7vw, 98px)',
            fontWeight: 800,
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            color: 'var(--black)',
            lineHeight: 0.92,
            marginBottom: 20,
          }}
        >
          Resources
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-17)',
            fontStyle: 'italic',
            color: 'var(--gray)',
            lineHeight: 1.7,
            maxWidth: 700,
          }}
        >
          Tools and guides to help you plan your slab, table, or custom piece before you buy. Everything here is free. No signup required.
        </p>
      </div>

      {/* Featured: Calculators */}
      <section style={{ padding: '72px var(--section-pad-x) 40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: 36,
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-10)',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--green)',
                marginBottom: 10,
              }}
            >
              Featured
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3vw, 40px)',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                textTransform: 'uppercase',
                color: 'var(--black)',
                lineHeight: 1,
              }}
            >
              Calculators
            </h2>
          </div>
          <Link href="/calculators" className="btn-primary">
            Use the Calculators →
          </Link>
        </div>

        <div
          className="resources-calc-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          <CalcCard
            num="01"
            title="Board Foot"
            href="/calculators?tool=board-foot"
            iconType="shelf"
            body="Calculate board feet and $/BF value from any slab's dimensions. Also tells you approximate weight and whether it needs freight."
            tag="Quick Tool"
          />
          <CalcCard
            num="02"
            title="Table Planner"
            href="/calculators?tool=table-planner"
            iconType="dining-table"
            body="Enter your room size and seating count to get the right slab dimensions. Supports live-edge and river (epoxy) tables. Pulls matching slabs from the yard."
            tag="Sizing Guide"
          />
          <CalcCard
            num="03"
            title="Quote Builder"
            href="/calculators?tool=quote-builder"
            iconType="coffee-table"
            body="Configure a custom piece in four steps and get an instant price range. At the end, one click pre-fills the custom project form."
            tag="Plan a Build"
          />
        </div>
      </section>

      {/* Coming soon */}
      <section
        style={{
          padding: '40px var(--section-pad-x) 120px',
        }}
      >
        <div
          style={{
            border: '1px solid var(--border)',
            background: '#fff',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-10)',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--tan)',
            }}
          >
            Coming Soon
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 2.4vw, 32px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
              color: 'var(--black)',
              lineHeight: 1.1,
              maxWidth: 640,
            }}
          >
            More guides and tools on the way
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--fs-17)',
              fontStyle: 'italic',
              color: 'var(--gray)',
              lineHeight: 1.7,
              maxWidth: 640,
            }}
          >
            We&apos;re building out a full library of free resources for woodworkers and slab buyers. Up next: a species comparison guide, a finish and care guide, and a hardness reference chart.
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .resources-calc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function CalcCard({
  num,
  title,
  href,
  iconType,
  body,
  tag,
}: {
  num: string
  title: string
  href: string
  iconType: 'dining-table' | 'coffee-table' | 'shelf'
  body: string
  tag: string
}) {
  return (
    <Link
      href={href}
      className="resource-calc-card"
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        padding: '32px 32px 28px',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.15s, transform 0.15s',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--tan)',
          }}
        >
          {num}
        </span>
        <div style={{ color: 'var(--black)', opacity: 0.75 }}>
          <PieceTypeIcon type={iconType} size={28} color="currentColor" />
        </div>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '-0.2px',
          color: 'var(--black)',
          lineHeight: 1.05,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-15)',
          fontStyle: 'italic',
          color: 'var(--gray)',
          lineHeight: 1.65,
          flex: 1,
        }}
      >
        {body}
      </p>

      <div
        style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTop: '1px solid var(--border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-9)',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '4px 10px',
            border: '1px solid var(--border)',
            color: 'var(--gray-dark)',
          }}
        >
          {tag}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-10)',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--green)',
          }}
        >
          Open →
        </span>
      </div>

      <style>{`
        .resource-calc-card:hover {
          border-color: var(--green) !important;
        }
      `}</style>
    </Link>
  )
}
