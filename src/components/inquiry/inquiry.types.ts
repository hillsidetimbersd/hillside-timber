export type DeliveryMethod = '' | 'pickup' | 'local' | 'nationwide'
export type DimensionsUnit = 'in' | 'cm'
export type SubmitStatus = 'idle' | 'uploading' | 'sending' | 'sent' | 'error'
export type Step = 1 | 2 | 3

export interface InquiryFormData {
  // Step 1
  name: string
  email: string
  phone: string
  zip: string
  deliveryMethod: DeliveryMethod

  // Step 2
  projectType: string
  projectTypeOther: string
  species: string[]
  finish: string
  dimensionsL: string
  dimensionsW: string
  dimensionsH: string
  dimensionsUnit: DimensionsUnit

  // Step 3
  budget: string
  timeline: string
  vision: string
  photos: File[]
}

export const INITIAL_FORM: InquiryFormData = {
  name: '', email: '', phone: '', zip: '', deliveryMethod: '',
  projectType: '', projectTypeOther: '', species: [], finish: '',
  dimensionsL: '', dimensionsW: '', dimensionsH: '', dimensionsUnit: 'in',
  budget: '', timeline: '', vision: '', photos: [],
}

export const SPECIES_OPTIONS = ['Walnut', 'White Oak', 'Cherry', 'Maple', 'Ash', 'Pine', 'Cedar', 'Not Sure']
export const FINISH_OPTIONS = ['Natural / Raw', 'Matte Oil', 'Satin Lacquer', 'Semi-Gloss', 'Painted', 'Not Sure']
export const BUDGET_OPTIONS = ['Under $1,000', '$1,000 to $3,000', '$3,000 to $6,000', '$6,000 to $12,000', '$12,000+']
export const TIMELINE_OPTIONS = ['As Soon As Possible', 'Within 3 Months', '3 to 6 Months', '6+ Months', 'No Rush']

export function validateStep(step: Step, form: InquiryFormData): string | null {
  if (step === 1) {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits.'
    if (!/^\d{5}$/.test(form.zip)) return 'Zip code must be 5 digits.'
    if (!form.deliveryMethod) return 'Please select a delivery option.'
    return null
  }
  if (step === 2) {
    if (!form.projectType) return 'Please select a project type.'
    if (form.projectType === 'Other' && !form.projectTypeOther.trim()) return "Please tell us what you're building."
    if (form.species.length === 0) return 'Please select at least one wood species.'
    if (!form.finish) return 'Please select a finish preference.'
    return null
  }
  if (step === 3) {
    if (!form.budget) return 'Please select a budget range.'
    if (!form.timeline) return 'Please select a timeline.'
    if (form.vision.trim().length < 20) return 'Tell us a bit more. Even a sentence or two helps.'
    return null
  }
  return null
}
