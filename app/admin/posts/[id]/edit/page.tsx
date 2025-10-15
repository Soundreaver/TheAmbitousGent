'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { AIAssistant } from '@/components/admin/ai-assistant'
import { MediaUploader } from '@/components/admin/media-uploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Eye, Loader2, Trash2 } from 'lucide-react'
import { generateSlug } from '@/lib/blog-helpers'
import type { Category, Post } from '@/lib/types/blog'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    featured_image_alt: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published',
    seo_title: '',
    seo_description: '',
    seo_keywords: [] as string[],
  })

  // Load post and categories
  useEffect(() => {
    loadPost()
    loadCategories()
  }, [postId])

  const loadPost = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) throw error

      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        featured_image: data.featured_image || '',
        featured_image_alt: data.featured_image_alt || '',
        category_id: data.category_id || '',
        status: data.status || 'draft',
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || [],
      })
    } catch (error) {
      console.error('Error loading post:', error)
      alert('Failed to load post')
      router.push('/admin/posts')
    } finally {
      setLoadingPost(false)
    }
  }

  const loadCategories = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (data) setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title || !formData.content) {
      alert('Please enter title and content')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Calculate reading time
      const wordCount = formData.content.trim().split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)

      // Determine published_at value
      let publishedAt
      if (status === 'published' && formData.status === 'draft') {
        // Publishing a draft for the first time
        publishedAt = new Date().toISOString()
      } else if (status === 'draft') {
        // Changing to draft - set to null
        publishedAt = null
      }
      // If already published and staying published, don't update published_at (undefined = no change)

      const postData: any = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt,
        featured_image: formData.featured_image,
        featured_image_alt: formData.featured_image_alt,
        category_id: formData.category_id || null,
        status,
        reading_time: readingTime,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        seo_keywords: formData.seo_keywords,
      }

      // Only set published_at if we have a value
      if (publishedAt !== undefined) {
        postData.published_at = publishedAt
      }

      const { error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', postId)

      if (error) throw error

      alert(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      router.push('/admin/posts')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating post:', error)
      alert(error.message || 'Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      alert('Post deleted successfully!')
      router.push('/admin/posts')
    } catch (error: any) {
      console.error('Error deleting post:', error)
      alert(error.message || 'Failed to delete post')
      setLoading(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-heading text-white mb-2">Edit Post</h1>
        <p className="text-white/60">Update your blog content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white text-lg">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/5 border-white/20 text-white text-2xl h-14 font-heading"
              placeholder="Enter your post title..."
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-white/90">
              URL Slug
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="bg-white/5 border-white/20 text-white"
              placeholder="auto-generated-from-title"
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label className="text-white text-lg">Content *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
              placeholder="Start writing your amazing content..."
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-white/90">
              Excerpt
            </Label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-md px-4 py-3 resize-none outline-none transition-colors"
              placeholder="Brief summary of your post (optional)"
            />
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <AIAssistant
            title={formData.title}
            content={formData.content}
            onContentUpdate={(content) => setFormData(prev => ({ ...prev, content }))}
            onSEOUpdate={(seo) => setFormData(prev => ({
              ...prev,
              seo_title: seo.title,
              seo_description: seo.description,
              seo_keywords: seo.keywords,
            }))}
            onTagsUpdate={(tags) => {
              console.log('Suggested tags:', tags)
            }}
          />

          {/* Featured Image */}
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950/50 space-y-4">
            <h3 className="text-lg font-heading text-white">Featured Image</h3>
            <MediaUploader
              currentImage={formData.featured_image}
              onUploadComplete={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
            />
            {formData.featured_image && (
              <Input
                value={formData.featured_image_alt}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_alt: e.target.value }))}
                className="bg-white/5 border-white/20 text-white text-sm"
                placeholder="Alt text for accessibility"
              />
            )}
          </div>

          {/* Category */}
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950/50 space-y-4">
            <h3 className="text-lg font-heading text-white">Category</h3>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 text-white focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-md px-4 h-10 outline-none transition-colors"
            >
              <option value="" className="bg-zinc-900">Select category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-zinc-900">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* SEO */}
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950/50 space-y-4">
            <h3 className="text-lg font-heading text-white">SEO Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="seo_title" className="text-white/90 text-sm">
                SEO Title
              </Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                className="bg-white/5 border-white/20 text-white text-sm"
                placeholder="Leave blank to use post title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description" className="text-white/90 text-sm">
                SEO Description
              </Label>
              <textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border-white/20 text-white text-sm placeholder:text-white/40 focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-md px-4 py-2 resize-none outline-none transition-colors"
                placeholder="Meta description for search engines"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSubmit('published')}
              disabled={loading}
              className="w-full bg-gold-gradient text-black hover:shadow-gold h-12 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  {formData.status === 'published' ? 'Update & Publish' : 'Publish Now'}
                </>
              )}
            </Button>

            <Button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 h-12"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>

            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="outline"
              className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 h-12"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
