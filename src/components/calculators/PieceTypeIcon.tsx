interface Props {
  type: 'dining-table' | 'coffee-table' | 'bench' | 'desk' | 'mantel' | 'shelf'
  size?: number
  color?: string
}

export default function PieceTypeIcon({ type, size = 32, color = 'currentColor' }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 256 256',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  }

  switch (type) {
    case 'dining-table':
      return (
        <svg {...common}>
          <rect x="20" y="72" width="216" height="20" rx="3" fill={color} />
          <rect x="44" y="92" width="16" height="96" rx="3" fill={color} />
          <rect x="196" y="92" width="16" height="96" rx="3" fill={color} />
        </svg>
      )

    case 'coffee-table':
      return (
        <svg {...common}>
          <rect x="16" y="104" width="224" height="22" rx="3" fill={color} />
          <rect x="32" y="126" width="16" height="40" rx="3" fill={color} />
          <rect x="208" y="126" width="16" height="40" rx="3" fill={color} />
          <rect x="32" y="152" width="192" height="10" rx="3" fill={color} />
        </svg>
      )

    case 'bench':
      return (
        <svg {...common}>
          <rect x="20" y="96" width="216" height="16" rx="3" fill={color} />
          <rect x="44" y="112" width="14" height="72" rx="3" fill={color} />
          <rect x="198" y="112" width="14" height="72" rx="3" fill={color} />
          <rect x="30" y="172" width="36" height="12" rx="3" fill={color} />
          <rect x="190" y="172" width="36" height="12" rx="3" fill={color} />
        </svg>
      )

    case 'desk':
      return (
        <svg {...common}>
          <rect x="20" y="80" width="216" height="18" rx="3" fill={color} />
          <rect x="36" y="98" width="14" height="90" rx="3" fill={color} />
          <rect x="206" y="98" width="14" height="90" rx="3" fill={color} />
          <rect x="36" y="122" width="80" height="32" rx="2" fill="none" stroke={color} strokeWidth="10" />
        </svg>
      )

    case 'mantel':
      return (
        <svg {...common}>
          <rect x="16" y="76" width="224" height="22" rx="3" fill={color} />
          <rect x="30" y="98" width="18" height="110" rx="3" fill={color} />
          <rect x="208" y="98" width="18" height="110" rx="3" fill={color} />
          <rect x="30" y="198" width="196" height="10" rx="3" fill={color} />
          <rect x="70" y="118" width="116" height="72" rx="2" fill="none" stroke={color} strokeWidth="10" />
        </svg>
      )

    case 'shelf':
      return (
        <svg {...common}>
          <rect x="20" y="28" width="14" height="200" rx="3" fill={color} />
          <rect x="222" y="28" width="14" height="200" rx="3" fill={color} />
          <rect x="20" y="28" width="216" height="14" rx="2" fill={color} />
          <rect x="20" y="80" width="216" height="14" rx="2" fill={color} />
          <rect x="20" y="132" width="216" height="14" rx="2" fill={color} />
          <rect x="20" y="184" width="216" height="14" rx="2" fill={color} />
          <rect x="20" y="214" width="216" height="14" rx="2" fill={color} />
        </svg>
      )
  }
}
