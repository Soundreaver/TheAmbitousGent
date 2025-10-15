'use client'

import { useState, useEffect } from 'react'
import { NavigationAceternity } from '@/components/navigation-aceternity'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase'
import { formatDate, stripHtml } from '@/lib/blog-helpers'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Post, Category } from '@/lib/types/blog'

function PostCard({ post }: { post: Post }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/journal/${post.slug}`}>
        <article className="group h-full border border-white/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-300 bg-zinc-950">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
              <Image
                src={post.featured_image}
                alt={post.featured_image_alt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {post.category && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-black"
                  style={{ backgroundColor: post.category.color }}
                >
                  {post.category.name}
                </div>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-white/50 mb-3">
              <time>{formatDate(post.published_at)}</time>
              <span>•</span>
              <span>{post.reading_time} min read</span>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-heading text-white mb-3 group-hover:text-gold transition-colors line-clamp-2">
              {post.title}
            </h2>
            
            {/* Excerpt */}
            <p className="text-white/70 line-clamp-3 mb-4">
              {post.excerpt || stripHtml(post.content, 120)}
            </p>
            
            {/* Read More */}
            <div className="flex items-center gap-2 text-gold text-sm font-medium">
              Read More
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

export default function JournalPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const supabase = createClient()
      
      const [postsData, categoriesData] = await Promise.all([
        supabase
          .from('posts')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name')
      ])

      if (postsData.data) setPosts(postsData.data as Post[])
      if (categoriesData.data) setCategories(categoriesData.data as Category[])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category?.id === selectedCategory)
    : posts

  const selectedCategoryData = categories.find(c => c.id === selectedCategory)

  return (
    <>
      <NavigationAceternity />
      <main className="min-h-screen bg-black pt-32">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1 
                key={selectedCategory || 'all'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl lg:text-7xl font-heading tracking-widest mb-6"
              >
                {selectedCategory ? (
                  <>
                    <span 
                      className="inline-block px-6 py-2 rounded-full text-3xl md:text-4xl font-medium text-black mb-4"
                      style={{ backgroundColor: selectedCategoryData?.color }}
                    >
                      {selectedCategoryData?.name}
                    </span>
                    <br />
                    <span className="text-white text-4xl md:text-5xl">Articles</span>
                  </>
                ) : (
                  <span className="text-gold-gradient">The Ambitious Journal</span>
                )}
              </motion.h1>
              <motion.p 
                key={`desc-${selectedCategory || 'all'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl md:text-2xl text-white/70 leading-relaxed"
              >
                {selectedCategory && selectedCategoryData?.description
                  ? selectedCategoryData.description
                  : 'Your go-to resource for elevating not just how you look, but how you live.'}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <section className="py-8 border-y border-white/10">
            <div className="container mx-auto px-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'border-gold bg-gold/20 text-gold shadow-lg shadow-gold/20'
                      : 'border-white/20 text-white/90 hover:border-gold/40 hover:text-gold'
                  }`}
                >
                  All Posts
                  {!selectedCategory && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: 'auto' }}
                      className="ml-2 inline-block"
                    >
                      ({posts.length})
                    </motion.span>
                  )}
                </motion.button>
                {categories.map((category) => {
                  const count = posts.filter(p => p.category?.id === category.id).length
                  const isActive = selectedCategory === category.id
                  
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                        isActive
                          ? 'border-gold bg-gold/20 text-gold shadow-lg shadow-gold/20'
                          : 'border-white/20 text-white/90 hover:border-gold/40 hover:text-gold'
                      }`}
                    >
                      {category.name}
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: isActive ? 1 : 0, width: isActive ? 'auto' : 0 }}
                        className="ml-2 inline-block"
                      >
                        ({count})
                      </motion.span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-white/60 mt-4">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <h2 className="text-3xl font-heading text-white mb-4">
                  {selectedCategory ? 'No Posts in This Category Yet' : 'No Posts Yet'}
                </h2>
                <p className="text-white/70 mb-8">
                  {selectedCategory 
                    ? `Check back soon for new content in ${selectedCategoryData?.name}.`
                    : 'Stay tuned! Great content is coming soon.'}
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="inline-block px-6 py-3 bg-gold-gradient text-black rounded-md font-semibold hover:shadow-gold transition-all"
                  >
                    View All Posts
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
