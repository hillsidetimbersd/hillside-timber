import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const brandParam = url.searchParams.get('brand')
  const hostname = url.hostname
  const existingCookie = request.cookies.get('ww-brand')?.value

  // Determine brand from: query param > hostname > existing cookie > default HT
  let brand: 'ht' | 'sfw' | null = null
  if (brandParam === 'sfw' || brandParam === 'ht') {
    brand = brandParam
  } else if (hostname.includes('siouxfallswoodworking')) {
    brand = 'sfw'
  } else if (existingCookie === 'sfw' || existingCookie === 'ht') {
    brand = existingCookie
  }

  // If explicit brand param → persist in cookie, then redirect to clean URL
  if (brandParam === 'sfw' || brandParam === 'ht') {
    const cleanUrl = new URL(request.url)
    cleanUrl.searchParams.delete('brand')
    const response = NextResponse.redirect(cleanUrl)
    response.cookies.set('ww-brand', brand!, { path: '/', maxAge: 31536000, sameSite: 'lax' })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
}
