import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { formatDate } from '@/lib/blog-helpers'
import type { Post } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPosts() {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(name, color)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Post[]) || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function PostsListPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading text-white mb-2">Posts</h1>
          <p className="text-white/60">Manage your blog content</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-6 py-3 bg-gold-gradient text-black rounded-md font-semibold hover:shadow-gold transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {/* Stats */}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950/50">
            <div className="text-white/60 text-sm mb-1">Total Posts</div>
            <div className="text-3xl font-heading text-white">{posts.length}</div>
          </div>
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950/50">
            <div className="text-white/60 text-sm mb-1">Published</div>
            <div className="text-3xl font-heading text-green-400">
              {posts.filter(p => p.status === 'published').length}
            </div>
          </div>
          <div className="border border-white/10 rounded-lg p-6 bg-zinc-950/50">
            <div className="text-white/60 text-sm mb-1">Drafts</div>
            <div className="text-3xl font-heading text-yellow-400">
              {posts.filter(p => p.status === 'draft').length}
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="border border-white/10 rounded-lg p-12 bg-zinc-950/50 text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-2xl font-heading text-white mb-2">No posts yet</h2>
          <p className="text-white/60 mb-6">
            Start creating amazing content for your blog
          </p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-gradient text-black rounded-md font-semibold hover:shadow-gold transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-zinc-950/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/90 font-heading">Title</th>
                <th className="text-left p-4 text-white/90 font-heading hidden md:table-cell">Category</th>
                <th className="text-left p-4 text-white/90 font-heading hidden lg:table-cell">Date</th>
                <th className="text-left p-4 text-white/90 font-heading">Status</th>
                <th className="text-right p-4 text-white/90 font-heading">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-heading text-white">{post.title}</div>
                    <div className="text-sm text-white/50 mt-1">
                      {post.reading_time} min read • {post.views || 0} views
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {post.category ? (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium text-black"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    ) : (
                      <span className="text-white/40 text-sm">No category</span>
                    )}
                  </td>
                  <td className="p-4 text-white/60 text-sm hidden lg:table-cell">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'published' && (
                        <Link
                          href={`/journal/${post.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
                          title="View Post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-2 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-gold"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      {/* Delete button removed - use edit page to delete */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
