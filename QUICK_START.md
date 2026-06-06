# 🚀 VoiceFront - Quick Start

## Project Status: ✅ READY FOR DEPLOYMENT

Your Next.js frontend is fully configured and tested for serverless deployment on Vercel.

### What's Configured

✅ **Next.js 16.2.7** - Latest version with Turbopack  
✅ **Vercel Serverless** - Optimized for edge computing  
✅ **Production Build** - Successfully builds and compiles  
✅ **Dev Server** - Running on http://localhost:3000  
✅ **Environment Variables** - Backend URL configured  

### Key Files

- `next.config.js` - Vercel optimizations
- `vercel.json` - Serverless function config (512MB memory, 60s timeout)
- `VERCEL_DEPLOYMENT.md` - Complete deployment guide
- `app/page.js` - Main frontend with video/audio dubbing UI
- `.env` - Backend URL set to production Hugging Face space

### Quick Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production
npm run build           # Build for production
npm start              # Run production build locally

# Deployment
vercel deploy          # Deploy to Vercel (requires vercel CLI)
```

### Deployment Options

#### 1. Vercel CLI (Fastest)
```bash
npm install -g vercel
vercel
```

#### 2. GitHub Integration
Push to GitHub → Vercel auto-deploys

#### 3. Vercel Dashboard
https://vercel.com/new → Import your repo

### Features

- **Video Dubbing** - Upload videos, select target language
- **Audio Dubbing** - Upload audio files for dubbing
- **Voice Cloning** - Generate voice clones from reference audio
- **Smooth Scrolling** - Lenis integration for UI/UX
- **Responsive Design** - Mobile-optimized interface
- **Backend Integration** - Connected to Hugging Face API

### Next Steps

1. Push code to GitHub
2. Go to vercel.com/new
3. Import this repository
4. Set `NEXT_PUBLIC_BACKEND_URL` environment variable
5. Deploy!

Your app will be live at: `https://<project-name>.vercel.app`

---

For detailed deployment instructions, see `VERCEL_DEPLOYMENT.md`
