import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
export async function GET() {
  const h = await headers()
  return NextResponse.json({ brand: h.get('x-brand'), all: Object.fromEntries(h.entries()) })
}
