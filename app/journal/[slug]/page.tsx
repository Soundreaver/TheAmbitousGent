import { NavigationAceternity } from '@/components/navigation-aceternity'
import { Footer } from '@/components/footer'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog-helpers'
import { formatDate } from '@/lib/blog-helpers'
import { isSupabaseConfigured } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Post } from '@/lib/types/blog'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)
    return {
      title: post.seo_title || `${post.title} | The Ambitious Journal`,
      description: post.seo_description || post.excerpt,
      keywords: post.seo_keywords?.join(', '),
    }
  } catch {
    return {
      title: 'Post Not Found | The Ambitious Journal',
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Redirect to journal page if Supabase not configured
  if (!isSupabaseConfigured()) {
    redirect('/journal')
  }

  const { slug } = await params
  let post: Post
  let relatedPosts: Post[] = []

  try {
    post = await getPostBySlug(slug)
    relatedPosts = await getRelatedPosts(post.id, post.category_id, 3)
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }

  return (
    <>
      <NavigationAceternity />
      <main className="min-h-screen bg-black pt-32">
        {/* Article Header */}
        <article className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              {post.category && (
                <div className="mb-6">
                  <Link
                    href={`/journal/category/${post.category.slug}`}
                    className="inline-block px-4 py-2 rounded-full text-sm font-medium text-black hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.name}
                  </Link>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-white/60 mb-8 pb-8 border-b border-white/10">
                <time>{formatDate(post.published_at)}</time>
                <span>•</span>
                <span>{post.reading_time} min read</span>
                {post.views > 0 && (
                  <>
                    <span>•</span>
                    <span>{post.views} views</span>
                  </>
                )}
              </div>

              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative aspect-[21/9] mb-12 rounded-lg overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:text-white prose-p:text-white/80 prose-a:text-gold hover:prose-a:text-gold/80 prose-strong:text-white prose-code:text-gold prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-zinc-950/50">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-heading text-white mb-8">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/journal/${relatedPost.slug}`}
                      className="group border border-white/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all"
                    >
                      {relatedPost.featured_image && (
                        <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                          <Image
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-heading text-white group-hover:text-gold transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-white/50 mt-2">
                          {formatDate(relatedPost.published_at)} • {relatedPost.reading_time} min
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
                Ready to Elevate Your Style?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Book a consultation and discover your signature aesthetic.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-gold-gradient text-black rounded-md font-semibold hover:shadow-gold transition-all"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
