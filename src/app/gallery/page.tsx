import type { Metadata } from 'next'
import { getPortfolioProjects } from '@/lib/portfolio'
import GalleryClient from './GalleryClient'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Finished work from Hillside Timber and Sioux Falls Woodworking. Custom tables, mantels, and handcrafted pieces, photographed in full.',
}

export default async function GalleryPage() {
  const projects = await getPortfolioProjects()
  return <GalleryClient projects={projects} />
}
