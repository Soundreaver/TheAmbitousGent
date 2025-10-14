# The Ambitious Gent - Luxury Men's Image Consulting

A sophisticated single-page landing website for The Ambitious Gent, a premium men's lifestyle and image consulting brand. Built with Next.js 15, featuring a monochromatic dark theme, elegant animations, and seamless user experience.

## 🎯 Brand Identity

**Aesthetic**: Porsche Design × Tom Ford × Financial Times

**Core Values**: Luxury, Discretion, Confidence, Sophistication, Ambition, Timelessness

**Design Principles**:
- Monochromatic elegance (black and white only)
- Generous whitespace and restraint
- Purposeful, smooth animations
- Typographic excellence
- Dark theme for dramatic exclusivity

## ✨ Features

- **Single-Page Scrolling Experience** - Smooth navigation between sections
- **Dark Monochromatic Theme** - Black backgrounds with white text
- **Luxury Typography** - Playfair Display (headings) + Inter (body)
- **Framer Motion Animations** - Purposeful, elegant scroll-triggered effects
- **Fully Responsive** - Mobile-first design approach
- **Contact Form** - Supabase integration for form submissions
- **Accessibility** - WCAG AAA standards with skip-to-content link
- **Performance Optimized** - Server Components, lazy loading, optimized fonts

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **Animations**: Framer Motion
- **Backend**: Supabase
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Supabase account (for contact form)
- Git (for version control)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd the-ambitious-gent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get Supabase Credentials**:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Settings → API
4. Copy your Project URL and anon/public key

### 4. Setup Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for service role" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site.

## 📁 Project Structure

```
the-ambitious-gent/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API endpoint
│   ├── layout.tsx                # Root layout with fonts & metadata
│   ├── page.tsx                  # Home page (all sections)
│   ├── loading.tsx               # Loading state
│   └── globals.css               # Global styles & design tokens
├── components/
│   ├── sections/
│   │   ├── hero.tsx              # Hero section
│   │   ├── services.tsx          # Services grid
│   │   ├── about.tsx             # About/Philosophy
│   │   ├── experience.tsx        # Experience blocks
│   │   ├── testimonials.tsx      # Client testimonials
│   │   └── contact.tsx           # Contact form
│   ├── ui/                       # ShadCN UI components
│   ├── navigation.tsx            # Main navigation
│   ├── footer.tsx                # Site footer
│   └── skip-to-content.tsx       # Accessibility component
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── animations.ts             # Framer Motion presets
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── TESTING_CHECKLIST.md          # Comprehensive testing guide
├── DEPLOYMENT_GUIDE.md           # Step-by-step deployment
└── tag_build_guide.md            # Original build specifications
```

## 🎨 Design System

### Colors

```css
/* Primary */
--background: #000000 (Pure Black)
--foreground: #FFFFFF (Pure White)

/* Secondary */
--card: #0A0A0A (Very Dark Gray)
--accent: #1A1A1A (Dark Gray)

/* Borders */
--border: rgba(255, 255, 255, 0.1)
```

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Letter Spacing**: Wide (0.05em - 0.15em)
- **Line Height**: Relaxed (1.5 - 1.6)

### Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🧪 Testing

Run the comprehensive testing checklist:

```bash
# See TESTING_CHECKLIST.md for full details
```

Key areas to test:
- ✅ Navigation and smooth scrolling
- ✅ Contact form submission
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Animations and transitions
- ✅ Accessibility (keyboard navigation, screen readers)
- ✅ Browser compatibility (Chrome, Firefox, Safari, Edge)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

## 📊 Performance Targets

Target Lighthouse scores (all 90+):
- ⚡ Performance: 90+
- ♿ Accessibility: 90+
- 🎯 Best Practices: 90+
- 🔍 SEO: 90+

Core Web Vitals:
- FCP: < 1.5s
- LCP: < 2.5s
- TTI: < 3.5s
- CLS: < 0.1

## 🔒 Security

- ✅ Environment variables not committed
- ✅ Row Level Security (RLS) enabled on Supabase
- ✅ Input validation on client and server
- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Rate limiting considerations

## 🛣️ Roadmap

### Completed ✅
- [x] Core landing page with all sections
- [x] Dark monochromatic theme
- [x] Smooth scroll navigation
- [x] Contact form with Supabase
- [x] Responsive design
- [x] Accessibility features
- [x] Performance optimization

### Future Enhancements 🚀
- [ ] Add actual images to Experience section
- [ ] Implement blog/articles section
- [ ] Add case studies/portfolio
- [ ] Create admin dashboard for submissions
- [ ] Add analytics integration
- [ ] Implement newsletter functionality
- [ ] Add privacy policy and terms pages
- [ ] Multi-language support
- [ ] Dark/light theme toggle (optional)

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server (Turbopack)

# Production
npm run build        # Create production build
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🤝 Contributing

This is a private project for The Ambitious Gent. For any modifications or feature requests, please contact the development team.

## 📄 License

Private and proprietary. All rights reserved © 2025 The Ambitious Gent.

## 🆘 Support

For issues or questions:
1. Check [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
2. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Check console for errors
4. Verify Supabase connection

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Supabase Documentation](https://supabase.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com/)

---

**Built with precision. Designed with purpose. Delivered with excellence.**

*The Ambitious Gent - Where sophistication meets ambition.*
