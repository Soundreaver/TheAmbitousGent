import { NavigationAceternity } from '@/components/navigation-aceternity'
import { Footer } from '@/components/footer'
import { getPostsByCategory, getCategories } from '@/lib/blog-helpers'
import { formatDate, stripHtml } from '@/lib/blog-helpers'
import { isSupabaseConfigured, createClient } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Post, Category } from '@/lib/types/blog'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCategoryData(categorySlug: string) {
  if (!isSupabaseConfigured()) {
    return { posts: [], categories: [], currentCategory: null, notConfigured: true }
  }
  
  try {
    const supabase = createClient()
    
    // Get current category
    const { data: currentCategory } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', categorySlug)
      .single()
    
    if (!currentCategory) {
      notFound()
    }

    const [posts, categories] = await Promise.all([
      getPostsByCategory(categorySlug),
      getCategories(),
    ])
    
    return { posts, categories, currentCategory, notConfigured: false }
  } catch (error) {
    console.error('Error fetching category data:', error)
    notFound()
  }
}

function PostCard({ post }: { post: Post }) {
  return (
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
  )
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const { posts, categories, currentCategory, notConfigured } = await getCategoryData(slug)

  if (notConfigured) {
    notFound()
  }

  return (
    <>
      <NavigationAceternity />
      <main className="min-h-screen bg-black pt-32">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <span 
                  className="px-6 py-2 rounded-full text-lg font-medium text-black"
                  style={{ backgroundColor: currentCategory?.color }}
                >
                  {currentCategory?.name}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-widest mb-6 text-white">
                {currentCategory?.name} Articles
              </h1>
              {currentCategory?.description && (
                <p className="text-xl text-white/70 leading-relaxed">
                  {currentCategory.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 border-y border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/journal"
                className="px-4 py-2 rounded-full border border-white/20 text-white/90 hover:border-gold/40 hover:text-gold transition-all text-sm"
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/journal/category/${category.slug}`}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    category.slug === slug
                      ? 'border-gold/40 text-gold bg-gold/10'
                      : 'border-white/20 text-white/90 hover:border-gold/40 hover:text-gold'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-3xl font-heading text-white mb-4">No Posts in This Category Yet</h2>
                <p className="text-white/70 mb-8">
                  Check back soon for new content in {currentCategory?.name}.
                </p>
                <Link
                  href="/journal"
                  className="inline-block px-6 py-3 bg-gold-gradient text-black rounded-md font-semibold hover:shadow-gold transition-all"
                >
                  View All Posts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
