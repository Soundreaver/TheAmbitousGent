import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize with API key - using NEXT_PUBLIC for client-side access
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''

if (!apiKey) {
  console.warn('Gemini API key not found. AI features will not work. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local')
}

const genAI = new GoogleGenerativeAI(apiKey)

export async function generateBlogContent(prompt: string, temperature: number = 0.7) {
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.')
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature,
        maxOutputTokens: 2048,
      }
    })
    
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    throw new Error(error.message || 'Failed to generate content. Please check your API key.')
  }
}

export async function optimizeSEO(title: string, content: string) {
  const prompt = `You are an SEO expert. Based on this blog post, generate:
1. An optimized SEO title (max 60 characters)
2. A compelling meta description (max 160 characters)
3. 5-7 relevant keywords

Blog Title: ${title}
Blog Content: ${content.substring(0, 500)}...

Return the response in this JSON format:
{
  "title": "...",
  "description": "...",
  "keywords": ["keyword1", "keyword2", ...]
}`

  try {
    const result = await generateBlogContent(prompt, 0.3)
    // Try to parse JSON from the response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || parsed.seo_title || title,
        description: parsed.description || parsed.seo_description || '',
        keywords: parsed.keywords || []
      }
    }
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('SEO Optimization Error:', error)
    return {
      title: title,
      description: content.substring(0, 160),
      keywords: []
    }
  }
}

export async function checkGrammar(content: string) {
  const prompt = `You are a professional editor. Review this text for grammar, spelling, and style issues. Provide specific, actionable suggestions for improvement.

Text to review:
${content.substring(0, 1000)}

Provide 3-5 clear suggestions as a simple text response.`

  try {
    const result = await generateBlogContent(prompt, 0.2)
    return result
  } catch (error) {
    console.error('Grammar Check Error:', error)
    return 'Unable to check grammar at this time.'
  }
}

export async function generateBlogIdeas(topic: string, count: number = 5) {
  const prompt = `Generate ${count} compelling blog post ideas about "${topic}" for a men's lifestyle and fashion blog called "The Ambitious Journal". 

For each idea, provide:
1. A catchy title
2. A brief description
3. Suggested main points to cover

Return as JSON array:
[
  {
    "title": "...",
    "description": "...",
    "main_points": ["point1", "point2", "point3"]
  }
]`

  try {
    const result = await generateBlogContent(prompt, 0.8)
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return []
  } catch (error) {
    console.error('Blog Ideas Generation Error:', error)
    return []
  }
}

export async function improveParagraph(paragraph: string, style: 'professional' | 'casual' | 'persuasive' = 'professional') {
  const styleGuides = {
    professional: 'sophisticated, well-structured, and authoritative',
    casual: 'conversational, friendly, and relatable',
    persuasive: 'compelling, engaging, and action-oriented'
  }

  const prompt = `Rewrite this paragraph to be more ${styleGuides[style]}. Maintain the core message but improve clarity, flow, and impact.

Original paragraph:
${paragraph}

Return only the improved paragraph, no explanation needed.`

  try {
    return await generateBlogContent(prompt, 0.7)
  } catch (error) {
    console.error('Paragraph Improvement Error:', error)
    return paragraph
  }
}

export async function suggestTags(title: string, content: string, maxTags: number = 7) {
  const prompt = `Based on this blog post, suggest ${maxTags} relevant tags/topics that would help categorize and improve discoverability.

Title: ${title}
Content: ${content.substring(0, 300)}...

Return ONLY a JSON array of tag strings, nothing else: ["tag1", "tag2", "tag3"]`

  try {
    const result = await generateBlogContent(prompt, 0.5)
    const jsonMatch = result.match(/\[[\s\S]*?\]/)
    if (jsonMatch) {
      const tags = JSON.parse(jsonMatch[0])
      return Array.isArray(tags) ? tags : []
    }
    return []
  } catch (error) {
    console.error('Tag Suggestion Error:', error)
    return []
  }
}
