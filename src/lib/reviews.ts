// Single source of truth for customer reviews.
//
// Every entry here is a real, verified review pulled from Hillside Timber's public
// Google Business Profile and Facebook page. Nothing is invented. If a review was
// truncated at the source (Facebook clips long text), it is trimmed to its last
// complete sentence rather than guessed at. The `/reviews` page and the home-page
// Reviews strip both read from this file, so the words stay consistent everywhere.

export type ReviewSource = 'google' | 'facebook'

export type Review = {
  id: string
  source: ReviewSource
  author: string
  /** Google "Local Guide" or similar standing, shown as a small credibility note. */
  standing?: string
  /** Star rating for Google reviews (1-5). Facebook uses `recommend` instead. */
  rating?: number
  /** Facebook posts a binary "recommends" rather than a star rating. */
  recommend?: boolean
  text: string
  /** A short, honest detail pulled from the review itself (e.g. the piece bought). */
  context?: string
  /** The owner's public reply on the platform, where one was posted. */
  ownerReply?: string
  /** The standout quote, enlarged at the top of the reviews page. */
  featured?: boolean
  /** Shown in the 3-up strip on the home page. */
  home?: boolean
}

export const REVIEWS: Review[] = [
  {
    id: 'heidi-evilsizor',
    source: 'google',
    author: 'Heidi Evilsizor',
    standing: 'Local Guide',
    rating: 5,
    text:
      "The owner was super nice, friendly and communicative! He had a great selection of raw edge wood planks and timbers. He had a wealth of knowledge on how to work with them and was very up front about his prices and how they would look when finished. We were very impressed! We'll definitely be coming back! His son Sam, was out helping and very kind and very professional as well!",
    context: 'Raw-edge planks & timbers',
    ownerReply: 'Thank you Heidi',
    featured: true,
  },
  {
    id: 'john-stevens',
    source: 'facebook',
    author: 'John Stevens',
    recommend: true,
    text:
      'Expert craftsmanship is quickly dying. Not here. 2 generations of experts. Excellent choice for any custom wood project.',
    context: 'Custom wood projects',
    home: true,
  },
  {
    id: 'tyler-curtis',
    source: 'google',
    author: 'Tyler Curtis',
    rating: 5,
    text:
      'Purchased an Ash slab for a diy office desk project. He gave me great tips and the slab was great quality. Looking forward to purchasing another slab for a future coffee table project.',
    context: 'Ash slab · office desk',
    ownerReply: 'Thank you Tyler',
    home: true,
  },
  {
    id: 'orangesmoothie',
    source: 'google',
    author: 'OrangeSmoothie',
    standing: 'Local Guide',
    rating: 5,
    text:
      'Highly recommend! Super knowledgeable. Great selection of high quality wood at a great price, I would say the best in the area.',
    context: 'Best in the area',
    home: true,
  },
  {
    id: 'jim-glover',
    source: 'facebook',
    author: 'Jim Glover',
    recommend: true,
    // Original was clipped by Facebook ("…provide you with most anythin…"); trimmed to
    // its last complete sentence rather than reconstructed.
    text:
      'Great material, and great selection of material. Slavik is very friendly and knowledgeable.',
    context: 'Great selection',
  },
  {
    id: 'cathy-stoltz',
    source: 'facebook',
    author: 'Cathy Stoltz',
    recommend: true,
    text: 'Beautiful assortment of fine lumber and very personal service!',
    context: 'Personal service',
  },
]

export const featuredReview: Review =
  REVIEWS.find((r) => r.featured) ?? REVIEWS[0]

/** Wall cards on the reviews page: every review except the featured pull-quote. */
export const wallReviews: Review[] = REVIEWS.filter((r) => !r.featured)

/** The 3-up strip on the home page. */
export const homeReviews: Review[] = REVIEWS.filter((r) => r.home)

// Aggregate trust signals. Google shows a perfect 5.0; a fourth Google review
// (Arbor Master, 5 stars, no written text) counts toward the rating but gets no card.
// All three Facebook reviews are "recommends," so the recommend rate is 100%.
export const REVIEW_STATS = {
  rating: '5.0',
  recommendPct: '100%',
  generations: '2',
  sinceYear: 2021,
}

// Real destinations for the platform links. Reused by every CTA so there is one
// place to update them.
//
// `google` is the public profile, where visitors read the reviews (Google's own
// "Write a review" button lives there too). `googleWrite` is the destination for the
// "review us" CTA: point it at the direct composer short link from the Google Business
// Profile (g.page/r/...) to open the review form in one tap. Until that link is in
// hand it falls back to the profile, and the CTA is labelled to match (it sends people
// to the profile, it does not claim to open the composer).
export const REVIEW_LINKS = {
  google: 'https://share.google/TYfE52NjboVI1xRtI',
  googleWrite: 'https://share.google/TYfE52NjboVI1xRtI',
  facebook: 'https://www.facebook.com/hillsidetimber',
}
