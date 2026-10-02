export interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  message: string | null
  source: string
  status: 'new' | 'contacted' | 'closed'
  createdAt: Date
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: 'subscribed' | 'unsubscribed'
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  stats: string[]
  tags: string[]
  imageUrl: string | null
  link: string | null
  isFeatured: boolean
  status: 'live' | 'coming_soon'
  sortOrder: number
}

export interface Testimonial {
  id: string
  quote: string
  clientName: string
  clientRole: string | null
  avatarUrl: string | null
  isPublished: boolean
  sortOrder: number
}

export interface Faq {
  id: string
  question: string
  answer: string
  isPublished: boolean
  sortOrder: number
}
