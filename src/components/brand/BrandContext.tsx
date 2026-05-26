'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { BrandConfig } from '@/types/brand'
import { getBrand } from '@/lib/brand'

const BrandContext = createContext<BrandConfig>(getBrand('ht'))

export function useBrand() {
  return useContext(BrandContext)
}

export function BrandProvider({ brand, children }: { brand: string; children: ReactNode }) {
  return (
    <BrandContext.Provider value={getBrand(brand)}>
      {children}
    </BrandContext.Provider>
  )
}
