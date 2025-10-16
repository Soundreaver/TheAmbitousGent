import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, service, type } = body

    // Determine form type
    const formType = type || 'brand' // 'brand' or 'client'
    const subject = formType === 'client' 
      ? `Client Consultation: ${service || 'General Inquiry'}`
      : 'Brand Partnership Inquiry'

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Supabase client with service role to bypass RLS
    // This is safe because we're validating input and running server-side
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Save to database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
        phone: phone || null,
        form_type: formType,
        service: service || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save contact submission')
    }

    // Prepare email content based on form type
    const emailContent = formType === 'client' ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
          New Client Consultation Request
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
          ${service ? `<p style="margin: 10px 0;"><strong>Service Interest:</strong> ${service}</p>` : ''}
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Client's Goals:</h3>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; line-height: 1.6;">
            ${message}
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">
          <strong>Submission ID:</strong> ${submission.id}<br>
          <strong>Received:</strong> ${new Date().toLocaleString()}<br>
          <strong>Type:</strong> Client Consultation
        </p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
          New Brand Partnership Inquiry
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Company/Contact:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Partnership Proposal:</h3>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; line-height: 1.6;">
            ${message}
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">
          <strong>Submission ID:</strong> ${submission.id}<br>
          <strong>Received:</strong> ${new Date().toLocaleString()}<br>
          <strong>Type:</strong> Brand Partnership
        </p>
      </div>
    `

    // Send email notification via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'The Ambitious Gent <onboarding@resend.dev>',
      to: ['soundburztwave@gmail.com'], // Your Resend account email
      subject: `[TAG] ${subject}`,
      html: emailContent,
    })

    if (emailError) {
      console.error('Email error:', emailError)
      // Still return success since message was saved to database
      return NextResponse.json({
        success: true,
        message: 'Message saved but email notification failed',
        submissionId: submission.id,
      })
    }

    return NextResponse.json({
      success: true,
      message: formType === 'client' 
        ? 'Thank you for your consultation request. We\'ll be in touch within 24 hours!'
        : 'Thank you for your partnership inquiry. We\'ll review and respond shortly!',
      submissionId: submission.id,
      emailId: emailData?.id,
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
