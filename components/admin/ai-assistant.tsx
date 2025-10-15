'use client'

import { useState } from 'react'
import { Sparkles, Wand2, CheckCircle2, Tags, Lightbulb, Loader2 } from 'lucide-react'
import { 
  generateBlogContent, 
  optimizeSEO, 
  checkGrammar, 
  improveParagraph,
  suggestTags,
  generateBlogIdeas
} from '@/lib/gemini'

interface AIAssistantProps {
  title: string
  content: string
  onContentUpdate: (content: string) => void
  onSEOUpdate: (seo: { title: string; description: string; keywords: string[] }) => void
  onTagsUpdate: (tags: string[]) => void
}

export function AIAssistant({ title, content, onContentUpdate, onSEOUpdate, onTagsUpdate }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<string>('')

  const handleGenerateContent = async () => {
    if (!title) {
      alert('Please enter a title first')
      return
    }
    
    setLoading('generate')
    setResult('')
    
    try {
      const generated = await generateBlogContent(
        `Write a comprehensive blog post about: ${title}. Make it engaging, informative, and professional.`
      )
      onContentUpdate(generated)
      setResult('Content generated successfully!')
      setTimeout(() => setResult(''), 3000)
    } catch (error) {
      setResult('Error generating content. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleOptimizeSEO = async () => {
    if (!title || !content) {
      alert('Please enter title and content first')
      return
    }
    
    setLoading('seo')
    setResult('')
    
    try {
      const seo = await optimizeSEO(title, content)
      onSEOUpdate(seo)
      setResult('SEO metadata generated!')
      setTimeout(() => setResult(''), 3000)
    } catch (error) {
      setResult('Error optimizing SEO. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleCheckGrammar = async () => {
    if (!content) {
      alert('Please enter content first')
      return
    }
    
    setLoading('grammar')
    setResult('')
    
    try {
      const suggestions = await checkGrammar(content)
      setResult(suggestions)
    } catch (error) {
      setResult('Error checking grammar. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleSuggestTags = async () => {
    if (!title || !content) {
      alert('Please enter title and content first')
      return
    }
    
    setLoading('tags')
    setResult('')
    
    try {
      const tags = await suggestTags(title, content)
      onTagsUpdate(tags)
      setResult(`Suggested tags: ${tags.join(', ')}`)
      setTimeout(() => setResult(''), 5000)
    } catch (error) {
      setResult('Error suggesting tags. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="border border-gold/30 rounded-lg bg-zinc-950/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-heading text-white">AI Writing Assistant</h3>
            <p className="text-sm text-white/60">Powered by Gemini</p>
          </div>
        </div>
        <span className="text-white/60 text-sm">{isExpanded ? 'Hide' : 'Show'}</span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          {/* Result Message */}
          {result && (
            <div className="p-4 rounded-lg bg-gold/10 border border-gold/20 text-white text-sm">
              {result}
            </div>
          )}

          {/* AI Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Generate Content */}
            <button
              onClick={handleGenerateContent}
              disabled={loading !== null}
              className="p-4 rounded-lg border border-white/20 hover:border-gold/40 bg-black hover:bg-white/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-3">
                {loading === 'generate' ? (
                  <Loader2 className="w-5 h-5 text-gold animate-spin mt-0.5" />
                ) : (
                  <Wand2 className="w-5 h-5 text-gold group-hover:scale-110 transition-transform mt-0.5" />
                )}
                <div>
                  <h4 className="font-heading text-white mb-1">Generate Content</h4>
                  <p className="text-xs text-white/60">
                    Create a full blog post based on your title
                  </p>
                </div>
              </div>
            </button>

            {/* Optimize SEO */}
            <button
              onClick={handleOptimizeSEO}
              disabled={loading !== null}
              className="p-4 rounded-lg border border-white/20 hover:border-gold/40 bg-black hover:bg-white/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-3">
                {loading === 'seo' ? (
                  <Loader2 className="w-5 h-5 text-gold animate-spin mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-gold group-hover:scale-110 transition-transform mt-0.5" />
                )}
                <div>
                  <h4 className="font-heading text-white mb-1">Optimize SEO</h4>
                  <p className="text-xs text-white/60">
                    Generate SEO title, description & keywords
                  </p>
                </div>
              </div>
            </button>

            {/* Check Grammar */}
            <button
              onClick={handleCheckGrammar}
              disabled={loading !== null}
              className="p-4 rounded-lg border border-white/20 hover:border-gold/40 bg-black hover:bg-white/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-3">
                {loading === 'grammar' ? (
                  <Loader2 className="w-5 h-5 text-gold animate-spin mt-0.5" />
                ) : (
                  <Sparkles className="w-5 h-5 text-gold group-hover:scale-110 transition-transform mt-0.5" />
                )}
                <div>
                  <h4 className="font-heading text-white mb-1">Check Grammar</h4>
                  <p className="text-xs text-white/60">
                    Get grammar and style suggestions
                  </p>
                </div>
              </div>
            </button>

            {/* Suggest Tags */}
            <button
              onClick={handleSuggestTags}
              disabled={loading !== null}
              className="p-4 rounded-lg border border-white/20 hover:border-gold/40 bg-black hover:bg-white/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start gap-3">
                {loading === 'tags' ? (
                  <Loader2 className="w-5 h-5 text-gold animate-spin mt-0.5" />
                ) : (
                  <Tags className="w-5 h-5 text-gold group-hover:scale-110 transition-transform mt-0.5" />
                )}
                <div>
                  <h4 className="font-heading text-white mb-1">Suggest Tags</h4>
                  <p className="text-xs text-white/60">
                    Auto-generate relevant tags for your post
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Tips */}
          <div className="mt-4 p-4 rounded-lg bg-black border border-white/10">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <div className="text-xs text-white/60">
                <p className="font-semibold text-white/80 mb-1">Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Write a clear title before generating content</li>
                  <li>Use SEO optimization after finishing your draft</li>
                  <li>Check grammar before publishing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
