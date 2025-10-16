'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, Users, Briefcase, Calendar, Check, Archive, Eye, Filter } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  phone: string | null
  service: string | null
  form_type: 'brand' | 'client'
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  read_at: string | null
  notes: string | null
}

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'brand' | 'client'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = submissions

    if (filterType !== 'all') {
      filtered = filtered.filter(s => s.form_type === filterType)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus)
    }

    setFilteredSubmissions(filtered)
  }, [submissions, filterType, filterStatus])

  const fetchSubmissions = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
      setFilteredSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const updates: any = { status }
    if (status === 'read' && !selectedSubmission?.read_at) {
      updates.read_at = new Date().toISOString()
    }

    await supabase
      .from('contact_submissions')
      .update(updates)
      .eq('id', id)

    fetchSubmissions()
  }

  const viewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission)
    if (submission.status === 'new') {
      updateStatus(submission.id, 'read')
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      new: 'bg-green-400/20 text-green-400 border-green-400/30',
      read: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
      replied: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
      archived: 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30',
    }
    return badges[status as keyof typeof badges] || badges.new
  }

  const getFormTypeBadge = (type: string) => {
    return type === 'client' 
      ? 'bg-gold/20 text-gold border-gold/30'
      : 'bg-purple-400/20 text-purple-400 border-purple-400/30'
  }

  const stats = {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    brand: submissions.filter(s => s.form_type === 'brand').length,
    client: submissions.filter(s => s.form_type === 'client').length,
  }

  if (loading) {
    return <div className="text-white/60">Loading submissions...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading text-white mb-2">Contact Submissions</h2>
          <p className="text-white/60 text-sm">
            {stats.total} total • {stats.new} new • {stats.brand} brand • {stats.client} client
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/40" />
          <span className="text-white/60 text-sm">Type:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterType === 'all'
                ? 'bg-gold text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('brand')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterType === 'brand'
                ? 'bg-purple-400 text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Brand ({stats.brand})
          </button>
          <button
            onClick={() => setFilterType('client')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterType === 'client'
                ? 'bg-gold text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Client ({stats.client})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Status:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-gold text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('new')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              filterStatus === 'new'
                ? 'bg-green-400 text-black'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            New ({stats.new})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-zinc-950 border border-white/10 rounded-lg p-8 text-center">
          <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">
            {filterType !== 'all' || filterStatus !== 'all'
              ? 'No submissions match the current filters'
              : 'No contact submissions yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className={`bg-zinc-950 border rounded-lg p-4 cursor-pointer transition-all hover:border-gold/40 ${
                submission.status === 'new'
                  ? 'border-green-400/30'
                  : 'border-white/10'
              }`}
              onClick={() => viewSubmission(submission)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-white font-semibold">{submission.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded border ${getFormTypeBadge(submission.form_type)}`}>
                      {submission.form_type === 'client' ? (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Client
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Brand
                        </span>
                      )}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusBadge(submission.status)}`}>
                      {submission.status}
                    </span>
                    {submission.service && (
                      <span className="text-xs px-2 py-1 bg-white/5 text-white/60 rounded">
                        {submission.service.replace(/-/g, ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-2">{submission.email}</p>
                  <p className="text-white/80 line-clamp-2">{submission.message}</p>
                </div>
                <div className="text-right text-sm text-white/40 flex-shrink-0">
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                  <p>{new Date(submission.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-zinc-950 border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-heading text-white">
                      {selectedSubmission.subject || 'Contact Form Submission'}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded border ${getFormTypeBadge(selectedSubmission.form_type)}`}>
                      {selectedSubmission.form_type}
                    </span>
                  </div>
                  <p className="text-white/60">From: {selectedSubmission.name}</p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-white/60 hover:text-white text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/40 text-sm mb-1">Email</p>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-gold hover:text-gold/80">
                    {selectedSubmission.email}
                  </a>
                </div>

                {selectedSubmission.phone && (
                  <div>
                    <p className="text-white/40 text-sm mb-1">Phone</p>
                    <a href={`tel:${selectedSubmission.phone}`} className="text-gold hover:text-gold/80">
                      {selectedSubmission.phone}
                    </a>
                  </div>
                )}
              </div>

              {selectedSubmission.service && (
                <div>
                  <p className="text-white/40 text-sm mb-1">Service Interest</p>
                  <p className="text-white capitalize">{selectedSubmission.service.replace(/-/g, ' ')}</p>
                </div>
              )}

              <div>
                <p className="text-white/40 text-sm mb-1">Message</p>
                <p className="text-white whitespace-pre-wrap bg-white/5 p-4 rounded-lg border border-white/10">
                  {selectedSubmission.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/40 text-sm mb-1">Received</p>
                  <p className="text-white">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>
                {selectedSubmission.read_at && (
                  <div>
                    <p className="text-white/40 text-sm mb-1">Read At</p>
                    <p className="text-white">
                      {new Date(selectedSubmission.read_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedSubmission.status !== 'replied' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedSubmission.id, 'replied')
                      setSelectedSubmission(null)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Replied
                  </button>
                )}
                {selectedSubmission.status !== 'archived' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedSubmission.id, 'archived')
                      setSelectedSubmission(null)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded hover:bg-white/20 transition-colors"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                )}
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject || 'Your inquiry'}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors ml-auto"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
