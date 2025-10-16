'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { AIAssistant } from '@/components/admin/ai-assistant'
import { MediaUploader } from '@/components/admin/media-uploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Eye, Loader2 } from 'lucide-react'
import { generateSlug } from '@/lib/blog-helpers'
import type { Category } from '@/lib/types/blog'

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (data) setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const newSlug = generateSlug(formData.title)
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }))
    }
  }, [formData.title])

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title || !formData.content) {
      alert('Please enter title and content')
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in')
        return
      }

      // Calculate reading time
      const wordCount = formData.content.trim().split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)

      const postData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        status,
        author_id: user.id,
        reading_time: readingTime,
        published_at: status === 'published' ? new Date().toISOString() : null,
        category_id: formData.category_id || null,
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single()

      if (error) throw error

      alert(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`)
      router.push('/admin/posts')
    } catch (error: any) {
      console.error('Error creating post:', error)
      alert(error.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-heading text-white mb-2">Create New Post</h1>
        <p className="text-white/60">Write and publish your blog content</p>
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
            <p className="text-xs text-white/50">
              Leave blank to auto-generate from title
            </p>
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
              // Tags will be handled separately
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
                className="w-full bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/40 focus:border-gold focus:ring-1 focus:ring-gold/20 rounded-md px-4 py-2 resize-none outline-none transition-colors"
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
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Publish Now
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
          </div>
        </div>
      </div>
    </div>
  )
}
