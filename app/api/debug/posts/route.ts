import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, status, published_at, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      posts: posts || [],
      count: posts?.length || 0
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// Fix drafts with published_at set
export async function POST() {
  try {
    const supabase = createClient()
    
    // Find drafts with published_at set
    const { data: drafts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, status, published_at')
      .eq('status', 'draft')
      .not('published_at', 'is', null)

    if (fetchError) throw fetchError

    if (!drafts || drafts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No drafts need fixing',
        fixed: 0
      })
    }

    // Fix them by setting published_at to null
    const { error: updateError } = await supabase
      .from('posts')
      .update({ published_at: null })
      .eq('status', 'draft')

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: `Fixed ${drafts.length} draft(s)`,
      fixed: drafts.length,
      posts: drafts
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
