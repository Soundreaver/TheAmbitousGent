import { createClient } from '@/lib/supabase'
import type { Post, Category, Tag, CreatePostInput, UpdatePostInput } from './types/blog'

// Calculate reading time from content
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Fetch all published posts
export async function getPublishedPosts(limit?: number) {
  const supabase = createClient()
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Post[]
}

// Fetch single post by slug
export async function getPostBySlug(slug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*),
      post_tags(tag:tags(*))
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  
  if (error) throw error
  
  // Flatten tags
  const post = data as any
  if (post.post_tags) {
    post.tags = post.post_tags.map((pt: any) => pt.tag)
    delete post.post_tags
  }
  
  return post as Post
}

// Fetch posts by category
export async function getPostsByCategory(categorySlug: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories!inner(*)
    `)
    .eq('category.slug', categorySlug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  
  if (error) throw error
  return data as Post[]
}

// Fetch all categories
export async function getCategories() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as Category[]
}

// Fetch all tags
export async function getTags() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as Tag[]
}

// Increment post views
export async function incrementPostViews(postId: string) {
  const supabase = createClient()
  
  const { error } = await supabase.rpc('increment_views', { post_id: postId })
  
  if (error) console.error('Error incrementing views:', error)
}

// Get related posts (same category, exclude current)
export async function getRelatedPosts(postId: string, categoryId: string | null, limit: number = 3) {
  if (!categoryId) return []
  
  const supabase = createClient()
  
  const { data, error} = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as Post[]
}

// Admin functions (require authentication)

// Create new post
export async function createPost(input: CreatePostInput, userId: string) {
  const supabase = createClient()
  
  const slug = input.slug || generateSlug(input.title)
  const readingTime = calculateReadingTime(input.content)
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...input,
      slug,
      reading_time: readingTime,
      author_id: userId,
      published_at: input.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()
  
  if (error) throw error
  
  // Add tags if provided
  if (input.tags && input.tags.length > 0) {
    await addTagsToPost(data.id, input.tags)
  }
  
  return data as Post
}

// Update post
export async function updatePost(input: UpdatePostInput) {
  const supabase = createClient()
  
  const updates: any = { ...input }
  delete updates.id
  delete updates.tags
  
  if (input.content) {
    updates.reading_time = calculateReadingTime(input.content)
  }
  
  if (input.status === 'published' && !input.published_at) {
    updates.published_at = new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', input.id)
    .select()
    .single()
  
  if (error) throw error
  
  // Update tags if provided
  if (input.tags) {
    await updatePostTags(input.id, input.tags)
  }
  
  return data as Post
}

// Delete post
export async function deletePost(postId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
  
  if (error) throw error
}

// Add tags to post
async function addTagsToPost(postId: string, tagIds: string[]) {
  const supabase = createClient()
  
  const postTags = tagIds.map(tagId => ({
    post_id: postId,
    tag_id: tagId,
  }))
  
  const { error } = await supabase
    .from('post_tags')
    .insert(postTags)
  
  if (error) throw error
}

// Update post tags (remove all and add new ones)
async function updatePostTags(postId: string, tagIds: string[]) {
  const supabase = createClient()
  
  // Remove existing tags
  await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)
  
  // Add new tags
  if (tagIds.length > 0) {
    await addTagsToPost(postId, tagIds)
  }
}

// Create or get tag by name
export async function createOrGetTag(name: string): Promise<Tag> {
  const supabase = createClient()
  const slug = generateSlug(name)
  
  // Try to find existing tag
  const { data: existing } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (existing) return existing as Tag
  
  // Create new tag
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, slug })
    .select()
    .single()
  
  if (error) throw error
  return data as Tag
}

// Get all posts for admin (including drafts)
export async function getAllPosts(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Post[]
}

// Format date for display
export function formatDate(date: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Strip HTML tags for excerpt
export function stripHtml(html: string, maxLength: number = 160): string {
  const text = html.replace(/<[^>]*>/g, '')
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
