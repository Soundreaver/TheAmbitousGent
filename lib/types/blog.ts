export type PostStatus = 'draft' | 'published' | 'scheduled'

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  created_at: string
}

export type Tag = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  featured_image_alt: string | null
  status: PostStatus
  published_at: string | null
  scheduled_for: string | null
  author_id: string
  category_id: string | null
  reading_time: number
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  views: number
  created_at: string
  updated_at: string
  // Joined data
  category?: Category
  tags?: Tag[]
  author?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export type CreatePostInput = {
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  featured_image_alt?: string
  status?: PostStatus
  published_at?: string
  scheduled_for?: string
  category_id?: string
  reading_time?: number
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  tags?: string[] // tag IDs
}

export type UpdatePostInput = Partial<CreatePostInput> & {
  id: string
}

export type Comment = {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved' | 'spam'
  created_at: string
}

export type Media = {
  id: string
  filename: string
  url: string
  thumbnail_url: string | null
  alt_text: string | null
  file_size: number
  mime_type: string
  uploaded_by: string
  created_at: string
}
