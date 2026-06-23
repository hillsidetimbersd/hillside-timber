'use client'

interface Props {
  options: string[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  mode: 'single' | 'multi'
  exclusiveOption?: string
}

export default function ChipSelector({ options, value, onChange, mode, exclusiveOption }: Props) {
  function isSelected(opt: string): boolean {
    if (mode === 'single') return value === opt
    return Array.isArray(value) && value.includes(opt)
  }

  function handleClick(opt: string) {
    if (mode === 'single') {
      onChange(opt)
      return
    }
    const current = Array.isArray(value) ? value : []
    if (opt === exclusiveOption) {
      onChange([opt])
      return
    }
    const withoutExclusive = current.filter(v => v !== exclusiveOption)
    if (withoutExclusive.includes(opt)) {
      onChange(withoutExclusive.filter(v => v !== opt))
    } else {
      onChange([...withoutExclusive, opt])
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const soft = opt.toLowerCase() === 'not sure'
        return (
          <button
            key={opt}
            type="button"
            onClick={() => handleClick(opt)}
            style={{
              fontFamily: soft ? 'var(--font-body)' : 'var(--font-display)',
              fontSize: soft ? '11px' : '9px',
              fontWeight: soft ? 400 : 700,
              fontStyle: soft ? 'italic' : 'normal',
              letterSpacing: soft ? '0' : '1.5px',
              textTransform: soft ? ('none' as const) : ('uppercase' as const),
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              border: isSelected(opt) ? '2px solid var(--green)' : '1px solid var(--border)',
              background: isSelected(opt) ? 'rgba(74,124,89,0.06)' : '#fff',
              color: isSelected(opt) ? 'var(--green)' : 'var(--gray)',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s, color 0.15s',
              whiteSpace: 'nowrap' as const,
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
