'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CalculatorShell, { type ToolKey } from '@/components/calculators/CalculatorShell'
import BoardFootCalculator from '@/components/calculators/BoardFootCalculator'
import TablePlanner from '@/components/calculators/TablePlanner'
import QuoteBuilder from '@/components/calculators/QuoteBuilder'

const VALID_TOOLS: ToolKey[] = ['board-foot', 'table-planner', 'quote-builder']

export default function CalculatorsPageClient() {
  const search = useSearchParams()
  const router = useRouter()

  const urlTool = search.get('tool') as ToolKey | null
  const initialTool: ToolKey = urlTool && VALID_TOOLS.includes(urlTool) ? urlTool : 'board-foot'

  const [activeTool, setActiveTool] = useState<ToolKey>(initialTool)

  // Keep URL in sync with selection without triggering a full nav
  useEffect(() => {
    const current = search.get('tool')
    if (current !== activeTool) {
      const next = new URLSearchParams(search.toString())
      next.set('tool', activeTool)
      router.replace(`?${next.toString()}`, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool])

  return (
    <CalculatorShell activeTool={activeTool} onChange={setActiveTool}>
      {activeTool === 'board-foot' && <BoardFootCalculator />}
      {activeTool === 'table-planner' && <TablePlanner />}
      {activeTool === 'quote-builder' && <QuoteBuilder />}
    </CalculatorShell>
  )
}
