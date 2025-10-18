import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'
import { getAllPosts } from '@/lib/blog-helpers'
import Link from 'next/link'
import { ContactSubmissions } from '@/components/admin/contact-submissions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDashboardData() {
  if (!isSupabaseConfigured()) {
    return { stats: null, recentPosts: [] }
  }

  const supabase = createAdminClient()
  
  try {
    // Get all posts without filtering by author
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(name, color)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const postsData = posts || []
    const published = postsData.filter(p => p.status === 'published').length
    const drafts = postsData.filter(p => p.status === 'draft').length
    const recentPosts = postsData.slice(0, 5)

    return {
      stats: { total: postsData.length, published, drafts },
      recentPosts,
    }
  } catch (error) {
    console.error('Dashboard error:', error)
    return { stats: null, recentPosts: [] }
  }
}

export default async function AdminDashboard() {
  const { stats, recentPosts } = await getDashboardData()

  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="border border-gold/30 rounded-lg p-8 bg-zinc-950/50">
          <h1 className="text-3xl font-heading text-gold mb-4">Welcome to TAG Admin</h1>
          <p className="text-white/80 mb-6">
            Complete the Supabase setup to start managing your blog.
          </p>
          <div className="space-y-4 text-white/70">
            <p>Follow the setup instructions in:</p>
            <code className="block bg-black p-3 rounded text-gold">
              docs/CMS_SETUP_INSTRUCTIONS.md
            </code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-heading text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950">
            <div className="text-white/60 text-sm mb-2">Total Posts</div>
            <div className="text-4xl font-heading text-gold">{stats.total}</div>
          </div>
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950">
            <div className="text-white/60 text-sm mb-2">Published</div>
            <div className="text-4xl font-heading text-green-400">{stats.published}</div>
          </div>
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950">
            <div className="text-white/60 text-sm mb-2">Drafts</div>
            <div className="text-4xl font-heading text-yellow-400">{stats.drafts}</div>
          </div>
        </div>
      )}

      {/* Recent Posts */}
      <div className="border border-white/10 rounded-lg p-6 bg-zinc-950">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading text-white">Recent Posts</h2>
          <Link
            href="/admin/posts"
            className="text-gold hover:text-gold/80 transition-colors text-sm"
          >
            View All →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 mb-4">No posts yet</p>
            <Link
              href="/admin/posts/new"
              className="inline-block px-6 py-3 bg-gold-gradient text-black rounded font-semibold hover:shadow-gold transition-all"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="block border border-white/10 rounded-lg p-4 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-heading mb-1">{post.title}</h3>
                    <p className="text-white/60 text-sm">
                      {new Date(post.created_at).toLocaleDateString()} • {post.reading_time} min read
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      post.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/posts/new"
          className="border border-white/10 rounded-lg p-6 bg-zinc-950 hover:border-gold/30 transition-colors group"
        >
          <h3 className="text-xl font-heading text-white mb-2 group-hover:text-gold transition-colors">
            Create New Post
          </h3>
          <p className="text-white/60 text-sm">
            Start writing with AI-powered assistance
          </p>
        </Link>

        <Link
          href="/admin/gallery"
          className="border border-white/10 rounded-lg p-6 bg-zinc-950 hover:border-gold/30 transition-colors group"
        >
          <h3 className="text-xl font-heading text-white mb-2 group-hover:text-gold transition-colors">
            Gallery Manager
          </h3>
          <p className="text-white/60 text-sm">
            Manage featured images for services page
          </p>
        </Link>

        <Link
          href="/journal"
          className="border border-white/10 rounded-lg p-6 bg-zinc-950 hover:border-gold/30 transition-colors group"
        >
          <h3 className="text-xl font-heading text-white mb-2 group-hover:text-gold transition-colors">
            View Public Blog
          </h3>
          <p className="text-white/60 text-sm">
            See how your posts look to visitors
          </p>
        </Link>
      </div>

      {/* Contact Submissions Section */}
      <div className="mt-12">
        <ContactSubmissions />
      </div>
    </div>
  )
}
